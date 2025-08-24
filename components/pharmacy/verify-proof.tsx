'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { simpleStore } from '@/src/lib/simple-store';

export function VerifyProof() {
  const [paidPrescriptions, setPaidPrescriptions] = useState<any[]>([]);
  const [proofHash, setProofHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const paid = simpleStore.getPaidPrescriptions();
    setPaidPrescriptions(paid);
  }, []);

  const handleVerifyProof = async () => {
    if (!proofHash.trim()) return;
    
    setIsLoading(true);
    try {
      // Find prescription by proof hash
      const prescription = paidPrescriptions.find(p => p.proofHash === proofHash);
      
      if (!prescription) {
        setVerificationResult({ isValid: false, error: 'Proof not found' });
        return;
      }
      
      // Simulate proof verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVerificationResult({
        isValid: true,
        prescription
      });
      
    } catch (error) {
      setVerificationResult({ isValid: false, error: 'Verification failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPrescription = async (prescriptionId: string) => {
    setIsLoading(true);
    try {
      // Mark prescription as verified
      simpleStore.verifyPrescription(prescriptionId);
      
      // Refresh list
      const updated = simpleStore.getPaidPrescriptions();
      setPaidPrescriptions(updated);
      
      console.log(`Verified prescription ${prescriptionId}`);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Verify Proofs</h2>
      
      {/* Proof Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Payment Proof</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter proof hash"
              value={proofHash}
              onChange={(e) => setProofHash(e.target.value)}
            />
            <Button onClick={handleVerifyProof} disabled={isLoading || !proofHash.trim()}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
          
          {verificationResult && (
            <div className={`p-4 rounded ${verificationResult.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
              {verificationResult.isValid ? (
                <div>
                  <p className="text-green-700 font-semibold">✓ Valid Proof</p>
                  <p><strong>Drug:</strong> {verificationResult.prescription.drugName}</p>
                  <p><strong>Quantity:</strong> {verificationResult.prescription.quantity}</p>
                  <p><strong>Patient:</strong> {verificationResult.prescription.patientWallet}</p>
                </div>
              ) : (
                <p className="text-red-700">✗ {verificationResult.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paid Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Paid Prescriptions Awaiting Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paidPrescriptions.map((prescription) => (
            <div key={prescription.id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{prescription.drugName}</h3>
                <Badge variant="secondary">Paid</Badge>
              </div>
              <p><strong>Quantity:</strong> {prescription.quantity}</p>
              <p><strong>Patient:</strong> {prescription.patientWallet.slice(0, 10)}...</p>
              <p><strong>Proof Hash:</strong> {prescription.proofHash}</p>
              <Button 
                onClick={() => handleVerifyPrescription(prescription.id)}
                disabled={isLoading}
                className="w-full mt-2"
              >
                Verify & Approve
              </Button>
            </div>
          ))}
          {paidPrescriptions.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No paid prescriptions awaiting verification</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}