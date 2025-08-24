// Contract integration with fallback
let Contract: any = null;
let Status: any = null;

try {
  if (typeof window === 'undefined') {
    // Server-side: load contract
    const contractModule = require('../managed/contract/index.cjs');
    Contract = contractModule.Contract;
    Status = contractModule.Status;
  }
} catch (error) {
  console.log('Contract not available, using fallback');
}

// Fallback Status enum
if (!Status) {
  Status = {
    init: 0,
    verified: 1,
    paid: 2,
    delivered: 3
  };
}

export { Status };

/**
 * Prescription Status Management Service
 * Contract integration with fallback to mock
 */

export class PrescriptionStatusManager {
  private static contract = Contract ? new Contract({}) : null;

  /**
   * Update prescription status using contract with fallback
   * init -> verified -> paid -> delivered
   */
  static async updateStatus(tokenId: string, newStatus: any, context?: any): Promise<boolean> {
    try {
      if (this.contract && context) {
        // Use real contract
        const tokenIdBigInt = BigInt(tokenId);
        
        switch (newStatus) {
          case Status.verified:
            this.contract.circuits.verifyPrescription(context, tokenIdBigInt);
            break;
          case Status.paid:
            this.contract.circuits.payPrescription(context, tokenIdBigInt);
            break;
          case Status.delivered:
            this.contract.circuits.deliverPrescription(context, tokenIdBigInt);
            break;
          default:
            throw new Error(`Invalid status transition to ${newStatus}`);
        }
        console.log(`Contract: Updated prescription ${tokenId} to status ${newStatus}`);
      } else {
        // Fallback to mock
        console.log(`Mock: Updating prescription ${tokenId} to status ${newStatus}`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return true;
    } catch (error) {
      console.error('Failed to update prescription status:', error);
      return false;
    }
  }

  /**
   * Validate if status transition is allowed (matches contract logic)
   */
  static isValidTransition(currentStatus: any, newStatus: any): boolean {
    const transitions: Record<number, number[]> = {
      [Status.init]: [Status.verified],
      [Status.verified]: [Status.paid], 
      [Status.paid]: [Status.delivered],
      [Status.delivered]: [], // Final status
    };

    return transitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Get prescription data from contract with fallback
   */
  static async getPrescription(tokenId: string, context?: any): Promise<any> {
    try {
      if (this.contract && context) {
        // Use real contract
        const result = this.contract.circuits.getPrescription(context, BigInt(tokenId));
        console.log(`Contract: Got prescription ${tokenId}`);
        return result.result;
      } else {
        // Fallback to mock
        console.log(`Mock: Getting prescription ${tokenId}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          id: tokenId,
          drugName: 'Mock Medicine',
          quantity: 30,
          status: Status.init
        };
      }
    } catch (error) {
      console.error('Failed to get prescription:', error);
      return null;
    }
  }

  /**
   * Get prescription status from contract with fallback
   */
  static async getStatus(tokenId: string, context?: any): Promise<any> {
    try {
      if (this.contract && context) {
        // Use real contract
        const result = this.contract.circuits.getStatus(context, BigInt(tokenId));
        console.log(`Contract: Got status for ${tokenId}`);
        return result.result;
      } else {
        // Fallback to mock
        console.log(`Mock: Getting status for ${tokenId}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return Status.init;
      }
    } catch (error) {
      console.error('Failed to get status:', error);
      return null;
    }
  }

  /**
   * Create prescription using contract with fallback
   */
  static async createPrescription(
    context: any,
    patientWallet: { bytes: Uint8Array },
    drugName: string,
    dosage: string,
    quantity: number,
    healthInsurance: string,
    issuedAt: bigint,
    expiresAt: bigint
  ): Promise<bigint | null> {
    try {
      if (this.contract && context) {
        // Use real contract
        const result = this.contract.circuits.createPrescription(
          context,
          patientWallet,
          drugName,
          dosage,
          BigInt(quantity),
          healthInsurance,
          issuedAt,
          expiresAt
        );
        console.log('Contract: Created prescription');
        return result.result;
      } else {
        // Fallback to mock
        console.log('Mock: Created prescription');
        return BigInt(Date.now());
      }
    } catch (error) {
      console.error('Failed to create prescription:', error);
      return null;
    }
  }

  /**
   * Get human-readable status display
   */
  static getStatusDisplay(status: any): { label: string; color: string; description: string } {
    const displays = {
      [Status.init]: {
        label: 'Issued',
        color: 'blue',
        description: 'Prescription issued by doctor'
      },
      [Status.verified]: {
        label: 'Verified',
        color: 'orange',
        description: 'Verified by pharmacy'
      },
      [Status.paid]: {
        label: 'Paid',
        color: 'green', 
        description: 'Payment completed'
      },
      [Status.delivered]: {
        label: 'Delivered',
        color: 'gray',
        description: 'Medicine delivered'
      },
    };

    return displays[status];
  }
}