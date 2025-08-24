import type { 
  PrescriptionData, 
  Status, 
  ImpureCircuits, 
  Witnesses, 
  Contract as ContractType,
  ContractReferenceLocations
} from '../managed/contract/index.d.cts';

declare global {
  interface Window {
    __compactRuntime?: {
      Contract: new <T, W extends Witnesses<T>>(options: { 
        witnesses: W;
        contractReferenceLocations?: ContractReferenceLocations;
      }) => ContractType<T, W>;
      CircuitContext: new <T>() => any;
    };
  }
}

type CircuitContext<T> = any;

export class ContractError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ContractError';
  }
}

const hexToUint8Array = (hex: string): { bytes: Uint8Array } => ({
  bytes: new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
});

export class PrescriptionContract<T = unknown, W extends Witnesses<T> = any> {
  private contract: { impureCircuits: ImpureCircuits<T> } | null = null;
  private context: CircuitContext<T>;
  
  constructor() {
    // Don't throw error in constructor, defer to initialization
    if (typeof window !== 'undefined' && window.__compactRuntime) {
      this.context = new window.__compactRuntime.CircuitContext<T>();
    }
  }

  async initialize(witnesses: W): Promise<void> {
    if (typeof window === 'undefined' || !window.__compactRuntime) {
      throw new ContractError('Compact runtime not available', 'RUNTIME_NOT_AVAILABLE');
    }
    
    if (!this.context) {
      this.context = new window.__compactRuntime.CircuitContext<T>();
    }
    
    this.contract = new window.__compactRuntime.Contract({ witnesses }) as any;
  }

  async createPrescription(
    patientWallet: string,
    drugName: string,
    dosage: string,
    quantity: number,
    healthInsurance: string,
    issuedAt: number | Date,
    expiresAt: number | Date
  ): Promise<bigint> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    
    const toTimestamp = (date: number | Date) => 
      Math.floor((date instanceof Date ? date.getTime() : date) / 1000);

    const result = await this.contract.impureCircuits.createPrescription(
      this.context,
      hexToUint8Array(patientWallet),
      drugName,
      dosage,
      BigInt(quantity),
      healthInsurance,
      BigInt(toTimestamp(issuedAt)),
      BigInt(toTimestamp(expiresAt))
    ) as unknown as bigint;

    return result;
  }

  async isDoctor(wallet: string): Promise<boolean> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    return this.contract.impureCircuits.isDoctor(this.context, hexToUint8Array(wallet)) as unknown as boolean;
  }

  async isPharmacy(wallet: string): Promise<boolean> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    return this.contract.impureCircuits.isPharmacy(this.context, hexToUint8Array(wallet)) as unknown as boolean;
  }

  async getPrescription(tokenId: bigint): Promise<PrescriptionData> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    return this.contract.impureCircuits.getPrescription(this.context, tokenId) as unknown as PrescriptionData;
  }

  async getStatus(tokenId: bigint): Promise<Status> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    return this.contract.impureCircuits.getStatus(this.context, tokenId) as unknown as Status;
  }

  async verifyPrescription(tokenId: bigint): Promise<void> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    await this.contract.impureCircuits.verifyPrescription(this.context, tokenId);
  }

  async payPrescription(tokenId: bigint): Promise<void> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    await this.contract.impureCircuits.payPrescription(this.context, tokenId);
  }

  async deliverPrescription(tokenId: bigint): Promise<void> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    await this.contract.impureCircuits.deliverPrescription(this.context, tokenId);
  }

  async addDoctor(doctorWallet: string): Promise<void> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    await this.contract.impureCircuits.addDoctor(this.context, hexToUint8Array(doctorWallet));
  }

  async addPharmacy(pharmacyWallet: string): Promise<void> {
    if (!this.contract) throw new ContractError('Not initialized', 'NOT_INITIALIZED');
    await this.contract.impureCircuits.addPharmacy(this.context, hexToUint8Array(pharmacyWallet));
  }
}

export const prescriptionContract = new PrescriptionContract();
