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

  createPrescription(data: Omit<Prescription, 'id' | 'isPaid' | 'isVerified' | 'createdAt'>): string {
    const id = Date.now().toString();
    this.prescriptions.push({
      ...data,
      id,
      isVerified: false,
      isPaid: false,
      createdAt: Date.now()
    });
    return id;
  }

  getPrescriptionsByPatient(patientWallet: string): Prescription[] {
    return this.prescriptions.filter(p => p.patientWallet === patientWallet);
  }

  payPrescription(id: string, proofHash: string): void {
    const prescription = this.prescriptions.find(p => p.id === id);
    if (prescription && prescription.isVerified) {
      prescription.isPaid = true;
      prescription.proofHash = proofHash;
    }
  }

  getUnverifiedPrescriptions(): Prescription[] {
    return this.prescriptions.filter(p => !p.isVerified);
  }

  getVerifiedUnpaidPrescriptions(): Prescription[] {
    return this.prescriptions.filter(p => p.isVerified && !p.isPaid);
  }

  verifyPrescription(id: string): void {
    const prescription = this.prescriptions.find(p => p.id === id);
    if (prescription) {
      prescription.isVerified = true;
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