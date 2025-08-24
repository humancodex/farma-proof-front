'use client';

import { WalletBuilder } from '@midnight-ntwrk/wallet-api';
import { NetworkId } from '@midnight-ntwrk/zswap';

// Import the contract
const Contract = require('../managed/contract/index.cjs').Contract;

class PharmaContract {
  private wallet: any = null;
  private contract: any = null;

  async initialize() {
    try {
      // Create wallet instance
      this.wallet = await WalletBuilder.build(
        'https://indexer.testnet-02.midnight.network/api/v1/graphql',
        'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws',
        'http://localhost:6300',
        'https://rpc.testnet-02.midnight.network',
        '0000000000000000000000000000000000000000000000000000000000000000',
        NetworkId.TestNet
      );

      await this.wallet.start();

      // Initialize contract
      this.contract = new Contract({});
      
      console.log('Contract initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      return false;
    }
  }

  async createPrescription(patientWallet: string, drugName: string, dosage: string, quantity: number, healthInsurance: string) {
    if (!this.wallet || !this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const context = { 
        originalState: await this.wallet.state().toPromise(),
        transactionContext: {}
      };

      const result = this.contract.circuits.createPrescription(
        context,
        { bytes: new Uint8Array(Buffer.from(patientWallet.replace('0x', ''), 'hex')) },
        drugName,
        dosage,
        BigInt(quantity),
        healthInsurance,
        BigInt(Math.floor(Date.now() / 1000)),
        BigInt(Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000))
      );

      return result.result;
    } catch (error) {
      console.error('Failed to create prescription:', error);
      throw error;
    }
  }

  async payPrescription(tokenId: bigint) {
    if (!this.wallet || !this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Create tDust transfer
      const transferRecipe = await this.wallet.transferTransaction([{
        amount: 50,
        type: { tag: 'native' },
        receiverAddress: 'mn_shield-addr_test1gpztte8j9ww3tpyjcq6dg3pv6zveq029ncfx8ashlc0992x2agyqxq8ae4s9sumzaxlmyxwyxkutcftu70kazfrrx00twndcr8euwwr3h5zpz8v9'
      }]);

      const provenTx = await this.wallet.proveTransaction(transferRecipe);
      const txHash = await this.wallet.submitTransaction(provenTx);

      // Update prescription status
      const context = { 
        originalState: await this.wallet.state().toPromise(),
        transactionContext: {}
      };

      this.contract.circuits.payPrescription(context, tokenId);

      return txHash;
    } catch (error) {
      console.error('Failed to pay prescription:', error);
      throw error;
    }
  }
}

export const pharmaContract = new PharmaContract();