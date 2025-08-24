import { Status } from '@/packages/types/prescription';

/**
 * Prescription Status Management Service
 * Handles the lifecycle of prescription status changes
 */

export class PrescriptionStatusManager {
  /**
   * Update prescription status based on the workflow
   * init -> verified -> paid -> delivered
   */
  static async updateStatus(prescriptionId: string, newStatus: Status): Promise<boolean> {
    try {
      // In production, this would update the blockchain and database
      console.log(`Updating prescription ${prescriptionId} to status: ${newStatus}`);
      
      // Mock implementation - in production this would:
      // 1. Validate the status transition is allowed
      // 2. Update the on-chain contract
      // 3. Update the local database
      // 4. Emit status change events
      
      return true;
    } catch (error) {
      console.error('Failed to update prescription status:', error);
      return false;
    }
  }

  /**
   * Validate if status transition is allowed
   */
  static isValidTransition(currentStatus: Status, newStatus: Status): boolean {
    const transitions: Record<Status, Status[]> = {
      [Status.init]: [Status.verified],
      [Status.verified]: [Status.paid],
      [Status.paid]: [Status.delivered],
      [Status.delivered]: [], // Final status
    };

    return transitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Get the next allowed statuses for a given status
   */
  static getNextStatuses(currentStatus: Status): Status[] {
    const transitions: Record<Status, Status[]> = {
      [Status.init]: [Status.verified],
      [Status.verified]: [Status.paid],
      [Status.paid]: [Status.delivered],
      [Status.delivered]: [], // Final status
    };

    return transitions[currentStatus] || [];
  }

  /**
   * Get human-readable status display
   */
  static getStatusDisplay(status: Status): { label: string; color: string; description: string } {
    const displays = {
      [Status.init]: {
        label: 'Issued',
        color: 'blue',
        description: 'Prescription has been issued by the doctor'
      },
      [Status.verified]: {
        label: 'Verified',
        color: 'orange', 
        description: 'Prescription verified by pharmacy'
      },
      [Status.paid]: {
        label: 'Paid',
        color: 'green',
        description: 'Payment completed by patient'
      },
      [Status.delivered]: {
        label: 'Delivered',
        color: 'gray',
        description: 'Medicine delivered to patient'
      },
    };

    return displays[status];
  }
}