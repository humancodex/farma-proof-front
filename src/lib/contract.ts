'use client';

import { WalletBuilder } from '@midnight-ntwrk/wallet';
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

  async getPaymentReceiver(prescriptionId: string): Promise<string | null> {
    try {
      // In real implementation, this would query the contract state
      // to get the pharmacy wallet or escrow contract address
      // For now, return null to use fallback logic
      return null;
    } catch (error) {
      console.error('Failed to get payment receiver:', error);
      return null;
    }
  }

  async payPrescription(tokenId: bigint, receiverAddress?: string) {
    if (!this.wallet || !this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const receiver = receiverAddress || process.env.NEXT_PUBLIC_RECEIVER_ADDRESS || 
                      'mn_shield-addr_test1gpztte8j9ww3tpyjcq6dg3pv6zveq029ncfx8ashlc0992x2agyqxq8ae4s9sumzaxlmyxwyxkutcftu70kazfrrx00twndcr8euwwr3h5zpz8v9';
      
      // Create tDust transfer
      const transferRecipe = await this.wallet.transferTransaction([{
        amount: 50,
        type: { tag: 'native' },
        receiverAddress: receiver
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
export const contract = pharmaContract;