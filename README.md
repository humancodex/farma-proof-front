# 🏥 FarmaProof - Private, Secure, Verified Medicine Access

> **Zero-knowledge verification of prescription purchases on Midnight (Cardano)**

FarmaProof is a revolutionary pharmacy management system that leverages blockchain technology and zero-knowledge proofs to ensure privacy, security, and authenticity in prescription management without compromising patient confidentiality.

## ✨ Features

### 🔐 **Privacy-First Design**
- **Zero-Knowledge Proofs**: Verify prescription validity without exposing patient data
- **Cryptographic Attestations**: Digital signatures ensure prescription authenticity
- **Patient Anonymity**: Full privacy protection while maintaining compliance

### 👥 **Multi-Role System**
- **Patients**: Secure prescription wallet, purchase management, order tracking
- **Doctors**: Issue digital prescriptions, manage patient records
- **Pharmacies**: Verify prescriptions, manage inventory, process orders
- **Admins**: System administration and user management
- **Auditors**: Compliance monitoring and system oversight

### 🚀 **Modern Technology Stack**
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Midnight Network (Cardano L2)
- **Cryptography**: Ed25519 signatures, BLAKE2b hashing
- **State Management**: React hooks, RxJS observables

## 🏗️ Architecture

### **Core Components**
```
farma-proof-front/
├── app/                    # Next.js app router
├── components/            # React components by role
│   ├── patient/          # Patient-specific components
│   ├── doctor/           # Doctor-specific components
│   ├── pharmacy/         # Pharmacy-specific components
│   ├── admin/            # Admin components
│   └── ui/               # Reusable UI components
├── src/lib/              # Core business logic
│   ├── attestation.ts    # ZK proof generation
│   ├── walletConnector.ts # Midnight wallet integration
│   └── crypto.ts         # Cryptographic utilities
└── packages/types/        # TypeScript type definitions
```

### **Data Flow**
1. **Doctor Issues Prescription** → Creates Verifiable Credential (VC)
2. **Patient Receives VC** → Stored in secure digital wallet
3. **Pharmacy Verifies VC** → Zero-knowledge proof validation
4. **Transaction Processing** → Blockchain-based order fulfillment

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ or Bun 1.0+
- Midnight Lace wallet extension
- Access to Midnight testnet

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd farma-proof-front
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Configure your environment variables
```

4. **Start development server**
```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔧 Configuration

### **Environment Variables**
```env
# Midnight Network Configuration
MIDNIGHT_NETWORK_ID=testnet
MIDNIGHT_RPC_URL=https://testnet.midnight.network
MIDNIGHT_EXPLORER_URL=https://explorer.testnet.midnight.network

# Cryptographic Keys
ATTESTATION_PRIVATE_KEY=your_private_key_here
ISSUER_POLICY_HASH=your_policy_hash_here

# API Endpoints
PROOF_SERVER_URL=https://prover.midnight.network
INDEXER_URL=https://indexer.testnet.midnight.network
```

### **Wallet Configuration**
1. Install [Midnight Lace](https://lace.io/) browser extension
2. Connect to Midnight testnet
3. Ensure sufficient test tokens for transactions

## 📱 Usage

### **For Patients**
1. **Login** with demo credentials (`maria@example.com` / `demo123`)
2. **View Prescriptions** in your digital wallet
3. **Purchase Medications** using zero-knowledge proofs
4. **Track Orders** with blockchain verification

### **For Doctors**
1. **Login** with doctor credentials (`dr.rivera@hospital.com` / `demo123`)
2. **Issue Prescriptions** with cryptographic signatures
3. **Manage Patients** and prescription history
4. **Generate VCs** for patient use

### **For Pharmacies**
1. **Login** with pharmacy credentials (`contact@andespharmacy.com` / `demo123`)
2. **Scan Prescriptions** using proof verification
3. **Process Orders** with blockchain validation
4. **Manage Inventory** and fulfillment

## 🔒 Security Features

### **Cryptographic Protection**
- **Ed25519 Signatures**: Tamper-proof prescription verification
- **BLAKE2b Hashing**: Secure data integrity checks
- **Zero-Knowledge Proofs**: Privacy-preserving validation
- **Blockchain Immutability**: Permanent audit trail

### **Privacy Safeguards**
- **Patient Pseudonyms**: Anonymous prescription identifiers
- **Encrypted Communications**: End-to-end data protection
- **Selective Disclosure**: Minimal data exposure
- **Audit Compliance**: Regulatory requirement fulfillment

## 🧪 Development

### **Available Scripts**
```bash
# Development
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server

# Testing
bun test             # Run test suite
bun test:watch       # Run tests in watch mode

# Linting & Formatting
bun lint             # Run ESLint
bun format           # Format code with Prettier

# Database
bun db:generate      # Generate database migrations
bun db:migrate       # Run database migrations
bun db:seed          # Seed database with demo data
```

### **Code Structure**
- **Components**: Role-based component organization
- **Hooks**: Custom React hooks for business logic
- **Types**: Comprehensive TypeScript definitions
- **Utils**: Reusable utility functions

## 🌐 Network Integration

### **Midnight Network**
- **Layer 2 Solution**: Scalable Cardano sidechain
- **Zero-Knowledge**: Privacy-preserving transactions
- **Smart Contracts**: Programmable prescription logic
- **Cross-Chain**: Interoperable with Cardano mainnet

### **Blockchain Features**
- **Prescription NFTs**: Unique digital prescription tokens
- **Smart Contracts**: Automated prescription validation
- **Decentralized Storage**: IPFS-based document storage
- **Multi-Signature**: Multi-party prescription approval

## 📊 Demo Data

### **Test Accounts**
```typescript
// Patient
email: "maria@example.com"
password: "demo123"

// Doctor
email: "dr.rivera@hospital.com"
password: "demo123"

// Pharmacy
email: "contact@andespharmacy.com"
password: "demo123"

// Admin
email: "admin@farmaproof.com"
password: "demo123"
```

## 🚧 Roadmap


### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits for versioning

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Midnight Foundation** for blockchain infrastructure
- **Cardano Community** for ecosystem support
- **Zero-Knowledge Research** community
- **Open Source Contributors** worldwide


**Built with ❤️ for a more secure and private healthcare future**

*FarmaProof - Where Privacy Meets Healthcare Innovation*
