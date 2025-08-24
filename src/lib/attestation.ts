import { blake2b } from '@noble/hashes/blake2b';
import * as ed from '@noble/ed25519';
import type { AttestationPayloadV2 } from '@/packages/types/attestation';

/**
 * Canonicalize JSON payload for consistent hashing
 */
export function canonicalJSON(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj === 'undefined') return 'undefined';
  if (typeof obj === 'boolean' || typeof obj === 'number') return JSON.stringify(obj);
  if (typeof obj === 'string') return JSON.stringify(obj);
  
  if (Array.isArray(obj)) {
    const parts = obj.map(item => canonicalJSON(item));
    return '[' + parts.join(',') + ']';
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => {
      const value = canonicalJSON(obj[key]);
      return `"${key}":${value}`;
    });
    return '{' + pairs.join(',') + '}';
  }
  
  throw new Error(`Cannot canonicalize type: ${typeof obj}`);
}

/**
 * Hash the attestation payload using BLAKE2b-256
 */
export function hashAttestationPayload(payload: AttestationPayloadV2): Uint8Array {
  const canonical = canonicalJSON(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(canonical);
  return blake2b(data, { dkLen: 32 });
}

/**
 * Sign the attestation payload hash with Ed25519
 */
export async function signAttestation(
  payloadHash: Uint8Array,
  privateKeyHex: string
): Promise<string> {
  const privateKey = privateKeyHex.replace('0x', '');
  const privateKeyBytes = Buffer.from(privateKey, 'hex');
  const signature = await ed.signAsync(payloadHash, privateKeyBytes);
  return '0x' + Buffer.from(signature).toString('hex');
}

/**
 * Verify an attestation signature
 */
export async function verifyAttestation(
  payloadHash: Uint8Array,
  signature: string,
  publicKeyHex: string
): Promise<boolean> {
  const publicKey = publicKeyHex.replace('0x', '');
  const publicKeyBytes = Buffer.from(publicKey, 'hex');
  const signatureBytes = Buffer.from(signature.replace('0x', ''), 'hex');
  return ed.verifyAsync(signatureBytes, payloadHash, publicKeyBytes);
}

/**
 * Build an attestation payload
 */
export function buildAttestationPayload({
  networkId,
  orderId,
  orderNonce,
  medicineCodeHash,
  qtyRequested,
  proof,
  issuerPolicyHash,
  patientBinding,
  ttlSeconds = 1800, // 30 minutes default
}: {
  networkId: string;
  orderId: string;
  orderNonce: `0x${string}`;
  medicineCodeHash: `0x${string}`;
  qtyRequested: number;
  proof: {
    publicSignalsCommitment: `0x${string}`;
    constraintsCommitment: `0x${string}`;
    circuitId: "rx-proof-v1";
  };
  issuerPolicyHash: `0x${string}`;
  patientBinding: `0x${string}`;
  ttlSeconds?: number;
}): AttestationPayloadV2 {
  const now = new Date();
  const validUntil = new Date(now.getTime() + ttlSeconds * 1000);

  return {
    attestation_version: "2",
    domain: "FARMA_PROOF/ACCEPT_PROOF",
    network_id: networkId,
    order_id: orderId,
    order_nonce: orderNonce,
    medicine_code_hash: medicineCodeHash,
    qty_requested: qtyRequested,
    proof_statement: {
      circuit_id: proof.circuitId,
      public_signals_commitment: proof.publicSignalsCommitment,
      constraints_commitment: proof.constraintsCommitment,
    },
    issuer_policy_hash: issuerPolicyHash,
    patient_binding: patientBinding,
    issued_at: now.toISOString(),
    valid_from: now.toISOString(),
    valid_until: validUntil.toISOString(),
  };
}