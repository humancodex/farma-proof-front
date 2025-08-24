/**
 * Attestation Flow Helpers
 * Client-side utilities for the attestation workflow
 */

import type { AttestationPayloadV2, AttestationResponse } from '@/packages/types/attestation';

/**
 * Create a new order
 */
export async function createOrder(params: {
  medicine_code_hash: string;
  qty_requested: number;
}): Promise<{ order_id: string; nonce_hex: string }> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return response.json();
}

/**
 * Request attestation from the verifier
 */
export async function requestAttestation(params: {
  payload: AttestationPayloadV2;
}): Promise<AttestationResponse> {
  const response = await fetch('/api/attest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get attestation');
  }

  return response.json();
}

/**
 * Get order details
 */
export async function getOrder(orderId: string): Promise<{
  id: string;
  nonce_hex: string;
  medicine_code_hash: string;
  qty_requested: number;
  state: string;
  created_at: string;
}> {
  const response = await fetch(`/api/orders?id=${orderId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch order');
  }

  return response.json();
}

export { buildAttestationPayload } from './attestation';