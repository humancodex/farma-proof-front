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
    name: "Ibuprofen 400mg",
    description: "Pain relief and anti-inflammatory medication",
    price: 8.50,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-2",
    name: "Amoxicillin 500mg",
    description: "Antibiotic for bacterial infections",
    price: 15.75,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-3",
    name: "Lisinopril 10mg",
    description: "ACE inhibitor for high blood pressure",
    price: 12.25,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-4",
    name: "Metformin 850mg",
    description: "Diabetes medication to control blood sugar",
    price: 9.99,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-5",
    name: "Omeprazole 20mg",
    description: "Proton pump inhibitor for acid reflux",
    price: 11.50,
    inStock: true,
    requiresPrescription: true,
  },
  {
    id: "med-6",
    name: "Vitamin D3 1000 IU",
    description: "Vitamin D supplement",
    price: 7.99,
    inStock: true,
    requiresPrescription: false,
  },
  {
    id: "med-7",
    name: "Acetaminophen 500mg",
    description: "Over-the-counter pain reliever and fever reducer",
    price: 5.99,
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
    medicines: ["med-1", "med-2", "med-3", "med-4", "med-5", "med-6", "med-7"],
  },
  {
    id: "pharmacy-2",
    name: "Río Salud",
    address: "456 Health Ave, Medical District",
    phone: "+1 (555) 987-6543",
    verified: true,
    medicines: ["med-1", "med-3", "med-4", "med-6", "med-7"],
  },
  {
    id: "pharmacy-3",
    name: "FarmaCorp Central",
    address: "789 Commerce Blvd, Downtown",
    phone: "+1 (555) 456-7890",
    verified: true,
    medicines: ["med-2", "med-3", "med-4", "med-5", "med-6", "med-7"],
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
    medicineName: "Ibuprofen 400mg",
    quantity: 30,
    dosage: "Take 1 tablet twice daily with food",
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
    medicineName: "Amoxicillin 500mg",
    quantity: 21,
    dosage: "Take 1 capsule three times daily for 7 days",
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
    medicineId: "med-3",
    medicineName: "Lisinopril 10mg",
    quantity: 30,
    dosage: "Take 1 tablet once daily in the morning",
    issuedAt: "2024-01-20T09:15:00Z",
    expiresAt: "2024-07-20T09:15:00Z",
    status: "valid",
    vcHash: "0xabcdef1234567890fedcba0987654321",
  },
  {
    id: "vc-4",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Rivera",
    medicineId: "med-4",
    medicineName: "Metformin 850mg",
    quantity: 60,
    dosage: "Take 1 tablet twice daily with meals",
    issuedAt: "2024-01-25T16:45:00Z",
    expiresAt: "2024-07-25T16:45:00Z",
    status: "valid",
    vcHash: "0xfedcba0987654321abcdef1234567890",
  },
  {
    id: "vc-5",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Rivera",
    medicineId: "med-5",
    medicineName: "Omeprazole 20mg",
    quantity: 30,
    dosage: "Take 1 capsule daily before breakfast",
    issuedAt: "2024-01-28T11:20:00Z",
    expiresAt: "2024-04-28T11:20:00Z",
    status: "valid",
    vcHash: "0x1234567890abcdefabcdef1234567890",
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
    medicineName: "Ibuprofen 400mg",
    quantity: 30,
    totalPrice: 8.50,
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
    medicineId: "med-3",
    medicineName: "Lisinopril 10mg",
    quantity: 30,
    totalPrice: 12.25,
    proofId: "proof-def456",
    status: "paid",
    createdAt: "2024-01-22T11:20:00Z",
    updatedAt: "2024-01-22T11:25:00Z",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
  },
  {
    id: "order-3",
    patientId: "patient-1",
    pharmacyId: "pharmacy-3",
    pharmacyName: "FarmaCorp Central",
    medicineId: "med-4",
    medicineName: "Metformin 850mg",
    quantity: 60,
    totalPrice: 9.99,
    proofId: "proof-ghi789",
    status: "proof_valid",
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:20:00Z",
    txHash: "0xfedcba0987654321fedcba0987654321fedcba09",
  },
]
