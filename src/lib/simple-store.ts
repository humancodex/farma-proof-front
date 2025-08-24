// Contract integration with fallback
let Contract: any = null;

try {
  if (typeof window === 'undefined') {
    // Server-side: load contract
    const contractModule = require('../managed/contract/index.cjs');
    Contract = contractModule.Contract;
  }
} catch (error) {
  console.log('Contract not available, using fallback');
}

interface Prescription {
  id: string;
  patientWallet: string;
  drugName: string;
  dosage: string;
  quantity: number;
  doctorWallet: string;
  isVerified: boolean;
  isPaid: boolean;
  proofHash?: string;
  createdAt: number;
}

class SimpleStore {
  private prescriptions: Prescription[] = [];
  private contract = Contract ? new Contract({}) : null;

  async createPrescription(data: Omit<Prescription, 'id' | 'isPaid' | 'isVerified' | 'createdAt'>): Promise<string> {
    const id = Date.now().toString();
    
    // Store locally
    this.prescriptions.push({
      ...data,
      id,
      isVerified: false,
      isPaid: false,
      createdAt: Date.now()
    });
    
    // Try contract integration
    if (this.contract) {
      try {
        const context = { originalState: {}, transactionContext: {} };
        const tokenId = this.contract.circuits.createPrescription(
          context,
          { bytes: new Uint8Array(Buffer.from(data.patientWallet.replace('0x', ''), 'hex')) },
          data.drugName,
          data.dosage,
          BigInt(data.quantity),
          'default-insurance',
          BigInt(Math.floor(Date.now() / 1000)),
          BigInt(Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000))
        );
        console.log('Contract: Created prescription', tokenId.result);
      } catch (error) {
        console.log('Contract creation failed, using local storage only:', error);
      }
    } else {
      console.log('Mock: Created prescription', id);
    }
    
    return id;
  }

  getPrescriptionsByPatient(patientWallet: string): Prescription[] {
    return this.prescriptions.filter(p => p.patientWallet === patientWallet);
  }

  async payPrescription(id: string, proofHash: string): Promise<void> {
    const prescription = this.prescriptions.find(p => p.id === id);
    if (prescription && prescription.isVerified) {
      prescription.isPaid = true;
      prescription.proofHash = proofHash;
      
      // Try contract integration
      if (this.contract) {
        try {
          const context = { originalState: {}, transactionContext: {} };
          this.contract.circuits.payPrescription(context, BigInt(id));
          console.log('Contract: Paid prescription', id);
        } catch (error) {
          console.log('Contract payment failed, using local storage only:', error);
        }
      } else {
        console.log('Mock: Paid prescription', id);
      }
    }
  }

  getUnverifiedPrescriptions(): Prescription[] {
    return this.prescriptions.filter(p => !p.isVerified);
  }

  getVerifiedUnpaidPrescriptions(): Prescription[] {
    return this.prescriptions.filter(p => p.isVerified && !p.isPaid);
  }

  async verifyPrescription(id: string): Promise<void> {
    const prescription = this.prescriptions.find(p => p.id === id);
    if (prescription) {
      prescription.isVerified = true;
      
      // Try contract integration
      if (this.contract) {
        try {
          const context = { originalState: {}, transactionContext: {} };
          this.contract.circuits.verifyPrescription(context, BigInt(id));
          console.log('Contract: Verified prescription', id);
        } catch (error) {
          console.log('Contract verification failed, using local storage only:', error);
        }
      } else {
        console.log('Mock: Verified prescription', id);
      }
    }
  }

  getPrescription(id: string): Prescription | undefined {
    return this.prescriptions.find(p => p.id === id);
  }

  getAll(): Prescription[] {
    return this.prescriptions;
  }
}

export const simpleStore = new SimpleStore();