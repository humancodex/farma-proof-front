// Status enum for prescription lifecycle
export enum Status {
  init = 'init',
  verified = 'verified', 
  paid = 'paid',
  delivered = 'delivered'
}

// Prescription data structure matching the new model
export interface PrescriptionData {
  drugName: string;
  dosage: string;
  quantity: number; // Uint<128> in the actual implementation
  healthInsurance: string;
  doctorWallet: string; // ZswapCoinPublicKey as string
  patientWallet: string; // ZswapCoinPublicKey as string
  issuedAt: number; // <64> timestamp
  expiresAt: number; // <64> timestamp
  status: Status;
}

// Extended prescription with additional metadata for UI
export interface PrescriptionVC extends PrescriptionData {
  id: string;
  vcHash: string;
  notes?: string;
}