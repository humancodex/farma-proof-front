export interface Medicine {
  id: string
  name: string
  description: string
  price: number
  inStock: boolean
  requiresPrescription: boolean
}

export interface Pharmacy {
  id: string
  name: string
  address: string
  phone: string
  verified: boolean
  medicines: string[] // medicine IDs
}

export interface PrescriptionVC {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  medicineId: string
  medicineName: string
  quantity: number
  dosage: string
  issuedAt: string
  expiresAt: string
  status: "valid" | "expired" | "used" | "revoked"
  vcHash: string
}

export interface Order {
  id: string
  patientId: string
  pharmacyId: string
  pharmacyName: string
  medicineId: string
  medicineName: string
  quantity: number
  totalPrice: number
  proofId: string
  status: "pending" | "proof_valid" | "paid" | "fulfilled" | "cancelled"
  createdAt: string
  updatedAt: string
  txHash?: string
}

// Demo medicines
export const DEMO_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    name: "DrugX",
    description: "Pain relief medication",
    price: 25.99,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-2",
    name: "DrugY",
    description: "Antibiotic treatment",
    price: 45.5,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-3",
    name: "VitaminC",
    description: "Vitamin C supplement",
    price: 12.99,
    inStock: true,
    requiresPrescription: false,
  },
]

// Demo pharmacies
export const DEMO_PHARMACIES: Pharmacy[] = [
  {
    id: "pharmacy-1",
    name: "Andes Pharmacy",
    address: "123 Main St, City Center",
    phone: "+1 (555) 123-4567",
    verified: true,
    medicines: ["med-1", "med-2", "med-3"],
  },
  {
    id: "pharmacy-2",
    name: "Río Salud",
    address: "456 Health Ave, Medical District",
    phone: "+1 (555) 987-6543",
    verified: true,
    medicines: ["med-1", "med-3"],
  },
]

// Demo prescription VCs for patient
export const DEMO_PRESCRIPTION_VCS: PrescriptionVC[] = [
  {
    id: "vc-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Rivera",
    medicineId: "med-1",
    medicineName: "DrugX",
    quantity: 30,
    dosage: "Take 1 tablet twice daily",
    issuedAt: "2024-01-15T10:00:00Z",
    expiresAt: "2024-04-15T10:00:00Z",
    status: "valid",
    vcHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
  },
  {
    id: "vc-2",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Rivera",
    medicineId: "med-2",
    medicineName: "DrugY",
    quantity: 14,
    dosage: "Take 1 tablet daily with food",
    issuedAt: "2024-01-10T14:30:00Z",
    expiresAt: "2024-02-10T14:30:00Z",
    status: "expired",
    vcHash: "0x9876543210fedcba0987654321abcdef",
  },
  {
    id: "vc-3",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Rivera",
    medicineId: "med-1",
    medicineName: "DrugX",
    quantity: 60,
    dosage: "Take 1 tablet as needed for pain",
    issuedAt: "2024-01-20T09:15:00Z",
    expiresAt: "2024-07-20T09:15:00Z",
    status: "valid",
    vcHash: "0xabcdef1234567890fedcba0987654321",
  },
]

// Demo orders
export const DEMO_ORDERS: Order[] = [
  {
    id: "order-1",
    patientId: "patient-1",
    pharmacyId: "pharmacy-1",
    pharmacyName: "Andes Pharmacy",
    medicineId: "med-1",
    medicineName: "DrugX",
    quantity: 30,
    totalPrice: 25.99,
    proofId: "proof-abc123",
    status: "fulfilled",
    createdAt: "2024-01-18T15:30:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    txHash: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "order-2",
    patientId: "patient-1",
    pharmacyId: "pharmacy-2",
    pharmacyName: "Río Salud",
    medicineId: "med-1",
    medicineName: "DrugX",
    quantity: 15,
    totalPrice: 12.99,
    proofId: "proof-def456",
    status: "paid",
    createdAt: "2024-01-22T11:20:00Z",
    updatedAt: "2024-01-22T11:25:00Z",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
  },
]
