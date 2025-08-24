export type AttestationPayloadV2 = {
  attestation_version: "2";
  domain: "FARMA_PROOF/ACCEPT_PROOF";
  network_id: string;
  order_id: string;
  order_nonce: `0x${string}`;
  medicine_code_hash: `0x${string}`;
  qty_requested: number;
  proof_statement: {
    circuit_id: "rx-proof-v1"; // TODO: change to the actual circuit id
    public_signals_commitment: `0x${string}`;
    constraints_commitment: `0x${string}`;
  };
  issuer_policy_hash: `0x${string}`;
  patient_binding: `0x${string}`;
  issued_at: string;
  valid_from: string;
  valid_until: string;
};

export type AttestationResponse = {
  verifier_key_id: string;
  signature_alg: "Ed25519";
  signature: string;
};