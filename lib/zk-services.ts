// Mock zero-knowledge proof services
export interface ZKProof {
  id: string
  vcId: string
  medicineId: string
  quantity: number
  proofHash: string
  isValid: boolean
  generatedAt: string
}

export interface PaymentResult {
  success: boolean
  txHash?: string
  error?: string
}

// Mock ZK proof generation
export async function generateZKProof(vcId: string, medicineId: string, quantity: number): Promise<ZKProof> {
  // Simulate proof generation delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const proofId = `proof-${Date.now()}`
  const proofHash = `0x${Math.random().toString(16).substr(2, 32)}`

  return {
    id: proofId,
    vcId,
    medicineId,
    quantity,
    proofHash,
    isValid: true,
    generatedAt: new Date().toISOString(),
  }
}

// Mock proof verification
export async function verifyZKProof(proofId: string): Promise<boolean> {
  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 95% success rate for demo
  return Math.random() > 0.05
}

// Mock Midnight payment
export async function payOnMidnight(amount: number, proofId: string): Promise<PaymentResult> {
  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 90% success rate for demo
  const success = Math.random() > 0.1

  if (success) {
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
    }
  } else {
    return {
      success: false,
      error: "Payment failed. Please try again.",
    }
  }
}
