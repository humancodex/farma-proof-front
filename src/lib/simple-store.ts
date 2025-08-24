interface Prescription {
  id: string;
  patientWallet: string;
  drugName: string;
  dosage: string;
  quantity: number;
  doctorWallet: string;
  isPaid: boolean;
  proofHash?: string;
  isVerified: boolean;
}

class SimpleStore {
  private prescriptions: Prescription[] = [];

  createPrescription(data: Omit<Prescription, 'id' | 'isPaid' | 'isVerified'>): string {
    const id = Date.now().toString();
    this.prescriptions.push({
      ...data,
      id,
      isPaid: false,
      isVerified: false
    });
    return id;
  }

  getPrescriptionsByPatient(patientWallet: string): Prescription[] {
    return this.prescriptions.filter(p => p.patientWallet === patientWallet);
  }

  payPrescription(id: string, proofHash: string): void {
    const prescription = this.prescriptions.find(p => p.id === id);
    if (prescription) {
      prescription.isPaid = true;
      prescription.proofHash = proofHash;
    }
  }

  getPaidPrescriptions(): Prescription[] {
    return this.prescriptions.filter(p => p.isPaid && !p.isVerified);
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
}

export const simpleStore = new SimpleStore();