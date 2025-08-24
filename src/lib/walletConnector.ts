import {
  BehaviorSubject,
  type Observable,
  concatMap,
  filter,
  firstValueFrom,
  interval,
  map,
  of,
  take,
  tap,
  throwError,
  timeout,
  catchError,
} from 'rxjs';
import { pipe as fnPipe } from 'fp-ts/function';
import {
  type DAppConnectorAPI,
  type DAppConnectorWalletAPI,
  type ServiceUriConfig,
} from '@midnight-ntwrk/dapp-connector-api';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import {
  type BalancedTransaction,
  type UnbalancedTransaction,
  createBalancedTx,
} from '@midnight-ntwrk/midnight-js-types';
import { type CoinInfo, Transaction, type TransactionId } from '@midnight-ntwrk/ledger';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import semver from 'semver';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

/**
 * Wallet connection status
 */
export interface WalletConnectionStatus {
  readonly status: 'connecting' | 'connected' | 'disconnected' | 'error';
  readonly error?: Error;
  readonly walletAPI?: DAppConnectorWalletAPI;
  readonly publicKey?: string;
  readonly balance?: number;
}

/**
 * FarmaProof contract providers for prescription management
 */
export interface FarmaProofProviders {
  privateStateProvider: any;
  zkConfigProvider: any;
  proofProvider: any;
  publicDataProvider: any;
  walletProvider: {
    coinPublicKey: string;
    encryptionPublicKey: string;
    balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction>;
  };
  midnightProvider: {
    submitTx(tx: BalancedTransaction): Promise<TransactionId>;
  };
}

/**
 * Manages wallet connections for FarmaProof prescription transactions
 */
export class FarmaProofWalletConnector {
  readonly #connectionStatusSubject: BehaviorSubject<WalletConnectionStatus>;
  #initializedProviders: Promise<FarmaProofProviders> | undefined;
  #walletAPI: DAppConnectorWalletAPI | undefined;

  /**
   * Initializes a new FarmaProofWalletConnector instance
   */
  constructor() {
    this.#connectionStatusSubject = new BehaviorSubject<WalletConnectionStatus>({
      status: 'disconnected',
    });
  }

  /**
   * Observable wallet connection status
   */
  get connectionStatus$(): Observable<WalletConnectionStatus> {
    return this.#connectionStatusSubject;
  }

  /**
   * Current wallet connection status
   */
  get connectionStatus(): WalletConnectionStatus {
    return this.#connectionStatusSubject.value;
  }

  /**
   * Connect to Midnight Lace wallet
   */
  async connect(): Promise<void> {
    this.#connectionStatusSubject.next({ status: 'connecting' });

    try {
      const { wallet, uris } = await this.connectToWallet();
      const walletState = await wallet.state();
      
      this.#walletAPI = wallet;
      
      this.#connectionStatusSubject.next({
        status: 'connected',
        walletAPI: wallet,
        publicKey: walletState.coinPublicKey,
        // Balance would be retrieved from wallet state
        balance: 0, // TODO: Implement balance retrieval
      });

      console.log('✅ Connected to Midnight Lace wallet');
      console.log(`📍 Network ID: ${getLedgerNetworkId()}`);
      console.log(`🔑 Public Key: ${walletState.coinPublicKey}`);
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.#connectionStatusSubject.next({
        status: 'error',
        error: errorObj,
      });
      throw errorObj;
    }
  }

  /**
   * Disconnect from wallet
   */
  disconnect(): void {
    this.#walletAPI = undefined;
    this.#initializedProviders = undefined;
    this.#connectionStatusSubject.next({ status: 'disconnected' });
    console.log('🔌 Disconnected from wallet');
  }

  /**
   * Get initialized providers for FarmaProof contracts
   */
  async getProviders(): Promise<FarmaProofProviders> {
    if (!this.#walletAPI) {
      throw new Error('Wallet not connected. Call connect() first.');
    }

    // Cache providers to avoid re-initialization
    return this.#initializedProviders ?? (this.#initializedProviders = this.initializeProviders());
  }

  /**
   * Submit a prescription transaction
   */
  async submitPrescriptionTransaction(tx: BalancedTransaction): Promise<TransactionId> {
    if (!this.#walletAPI) {
      throw new Error('Wallet not connected');
    }

    try {
      const txId = await this.#walletAPI.submitTransaction(tx);
      console.log('✅ Prescription transaction submitted:', txId);
      return txId;
    } catch (error) {
      console.error('❌ Failed to submit prescription transaction:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<number> {
    if (!this.#walletAPI) {
      throw new Error('Wallet not connected');
    }

    try {
      const state = await this.#walletAPI.state();
      // TODO: Extract actual balance from wallet state
      return 0; // Placeholder
    } catch (error) {
      console.error('❌ Failed to get wallet balance:', error);
      throw error;
    }
  }

  /**
   * Get current wallet address
   */
  getWalletAddress(): string | undefined {
    return this.connectionStatus.publicKey;
  }

  /**
   * Initialize providers for FarmaProof contracts
   */
  private async initializeProviders(): Promise<FarmaProofProviders> {
    if (!this.#walletAPI) {
      throw new Error('Wallet API not available');
    }

    const { wallet, uris } = await this.connectToWallet();
    const walletState = await wallet.state();
    const zkConfigPath = window.location.origin; // Path to ZK config

    return {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: 'farma-proof-private-state',
      }),
      zkConfigProvider: new FetchZkConfigProvider(zkConfigPath, fetch.bind(window)),
      proofProvider: httpClientProofProvider(uris.proverServerUri),
      publicDataProvider: indexerPublicDataProvider(uris.indexerUri, uris.indexerWsUri),
      walletProvider: {
        coinPublicKey: walletState.coinPublicKey,
        encryptionPublicKey: walletState.encryptionPublicKey,
        balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
          return wallet
            .balanceAndProveTransaction(
              ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
              newCoins,
            )
            .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
            .then(createBalancedTx);
        },
      },
      midnightProvider: {
        submitTx(tx: BalancedTransaction): Promise<TransactionId> {
          return wallet.submitTransaction(tx);
        },
      },
    };
  }

  /**
   * Connect to Midnight Lace wallet
   */
  private connectToWallet(): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> {
    const COMPATIBLE_CONNECTOR_API_VERSION = '1.x';

    return firstValueFrom(
      fnPipe(
        interval(100),
        map(() => (window as any).midnight?.mnLace),
        tap((connectorAPI) => {
          console.log('🔍 Checking for Midnight Lace wallet...', !!connectorAPI);
        }),
        filter((connectorAPI): connectorAPI is DAppConnectorAPI => !!connectorAPI),
        concatMap((connectorAPI) =>
          semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION)
            ? of(connectorAPI)
            : throwError(() => {
                console.error(
                  `❌ Incompatible wallet version. Expected: ${COMPATIBLE_CONNECTOR_API_VERSION}, Got: ${connectorAPI.apiVersion}`
                );

                return new Error(
                  `Incompatible version of Midnight Lace wallet found. Require '${COMPATIBLE_CONNECTOR_API_VERSION}', got '${connectorAPI.apiVersion}'.`,
                );
              }),
        ),
        tap(() => {
          console.log('✅ Compatible Midnight Lace wallet found. Connecting...');
        }),
        take(1),
        timeout({
          first: 5_000,
          with: () =>
            throwError(() => {
              console.error('❌ Could not find Midnight Lace wallet');
              return new Error('Could not find Midnight Lace wallet. Is the extension installed?');
            }),
        }),
        concatMap(async (connectorAPI) => {
          const isEnabled = await connectorAPI.isEnabled();
          console.log('🔓 Wallet enabled status:', isEnabled);
          return connectorAPI;
        }),
        timeout({
          first: 10_000,
          with: () =>
            throwError(() => {
              console.error('❌ Wallet failed to respond');
              return new Error('Midnight Lace wallet has failed to respond. Is the extension enabled?');
            }),
        }),
        concatMap(async (connectorAPI) => ({ 
          walletConnectorAPI: await connectorAPI.enable(), 
          connectorAPI 
        })),
        catchError((error) =>
          throwError(() => {
            console.error('❌ Unable to enable wallet connector');
            return new Error('Application is not authorized to connect to wallet');
          }),
        ),
        concatMap(async ({ walletConnectorAPI, connectorAPI }) => {
          const uris = await connectorAPI.serviceUriConfig();
          console.log('🌐 Retrieved service configuration');
          return { wallet: walletConnectorAPI, uris };
        }),
      ),
    );
  }
}

/**
 * Global instance of the wallet connector
 */
export const farmaProofWallet = new FarmaProofWalletConnector();