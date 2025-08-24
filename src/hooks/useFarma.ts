'use client';

import { useState, useCallback } from 'react';
import { createOrder, buildAttestationPayload, requestAttestation, getOrder } from '@/src/lib/attestationFlow';
import { generateProof } from '@/src/lib/zk';
import { OrderEscrow } from '@/src/lib/contracts';

export interface PurchaseParams {
  medicineCodeHash: `0x${string}`;
  qty: number;
  issuerPolicyHash: `0x${string}`;
  patientBinding: `0x${string}`;
  tokenCommitment?: `0x${string}`;
}

export interface PurchaseResult {
  orderId: string;
  txHash?: string;
  state: 'created' | 'attested' | 'accepted' | 'paid' | 'error';
  error?: string;
}

export function useFarma() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PurchaseResult | null>(null);
  const networkId = process.env.NEXT_PUBLIC_NETWORK_ID || 'midnight-testnet';

  const patientPurchase = useCallback(async ({
    medicineCodeHash,
    qty,
    issuerPolicyHash,
    patientBinding,
    tokenCommitment = '0x0000000000000000000000000000000000000000000000000000000000000000',
  }: PurchaseParams): Promise<PurchaseResult> => {
    setIsLoading(true);
    
    try {
      // Step 1: Create order
      console.log('Creating order...');
      const { order_id, nonce_hex } = await createOrder({
        medicine_code_hash: medicineCodeHash,
        qty_requested: qty,
      });
      
      setCurrentOrder({
        orderId: order_id,
        state: 'created',
      });

      // Step 2: Generate ZK proof
      console.log('Generating ZK proof...');
      const proof = await generateProof({
        tokenCommitment,
        medicineCodeHash,
        qtyRequested: qty,
        redeemedQty: 0,
        expiresAt: Date.now() + 3600_000, // 1 hour from now
        orderNonce: nonce_hex as `0x${string}`,
      });

      // Step 3: Build attestation payload
      const payload = buildAttestationPayload({
        networkId,
        orderId: order_id,
        orderNonce: nonce_hex as `0x${string}`,
        medicineCodeHash,
        qtyRequested: qty,
        proof,
        issuerPolicyHash,
        patientBinding,
        ttlSeconds: 1800, // 30 minutes
      });

      // Step 4: Request attestation from verifier
      console.log('Requesting attestation...');
      const { verifier_key_id, signature } = await requestAttestation({ payload });
      
      setCurrentOrder({
        orderId: order_id,
        state: 'attested',
      });

      // Step 5: Submit proof to smart contract
      console.log('Submitting proof to contract...');
      const acceptResult = await OrderEscrow.acceptProof(order_id, {
        payload,
        verifier_key_id,
        signature,
      });
      
      if (!acceptResult.success) {
        throw new Error('Failed to accept proof on-chain');
      }
      
      setCurrentOrder({
        orderId: order_id,
        state: 'accepted',
        txHash: acceptResult.txHash,
      });

      // Step 6: Process payment
      console.log('Processing payment...');
      const payResult = await OrderEscrow.pay(order_id, {
        amount: qty * 100, // Mock price calculation
      });
      
      if (!payResult.success) {
        throw new Error('Failed to process payment');
      }

      const result: PurchaseResult = {
        orderId: order_id,
        state: 'paid',
        txHash: payResult.txHash,
      };
      
      setCurrentOrder(result);
      return result;
      
    } catch (error) {
      console.error('Purchase failed:', error);
      const errorResult: PurchaseResult = {
        orderId: currentOrder?.orderId || '',
        state: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      setCurrentOrder(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [networkId, currentOrder]);

  const pharmacyFulfill = useCallback(async (orderId: string, tokenId?: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> => {
    setIsLoading(true);
    
    try {
      // Get order state from chain
      const orderState = await OrderEscrow.getOrderState(orderId);
      
      if (orderState.state !== 'PAID') {
        throw new Error(`Order not in PAID state: ${orderState.state}`);
      }
      
      // Fulfill the order
      const result = await OrderEscrow.fulfill(orderId, tokenId);
      
      if (!result.success) {
        throw new Error('Failed to fulfill order');
      }
      
      return {
        success: true,
        txHash: result.txHash,
      };
      
    } catch (error) {
      console.error('Fulfillment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrderStatus = useCallback(async (orderId: string) => {
    try {
      const order = await getOrder(orderId);
      const chainState = await OrderEscrow.getOrderState(orderId);
      
      return {
        ...order,
        chainState: chainState.state,
      };
    } catch (error) {
      console.error('Failed to get order status:', error);
      return null;
    }
  }, []);

  return {
    patientPurchase,
    pharmacyFulfill,
    getOrderStatus,
    isLoading,
    currentOrder,
  };
}