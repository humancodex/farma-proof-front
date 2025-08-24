'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { simpleStore } from '@/src/lib/simple-store';

export function PharmacyHome() {
  const [unverifiedPrescriptions, setUnverifiedPrescriptions] = useState<any[]>([]);
  const [verifiedPrescriptions, setVerifiedPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    const unverified = simpleStore.getUnverifiedPrescriptions();
    const verified = simpleStore.getAll().filter(p => p.isVerified);
    setUnverifiedPrescriptions(unverified);
    setVerifiedPrescriptions(verified);
  }, []);

  const handleVerify = (prescriptionId: string) => {
    simpleStore.verifyPrescription(prescriptionId);
    
    // Refresh lists
    const unverified = simpleStore.getUnverifiedPrescriptions();
    const verified = simpleStore.getAll().filter(p => p.isVerified);
    setUnverifiedPrescriptions(unverified);
    setVerifiedPrescriptions(verified);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
      
      {/* Prescriptions to Verify */}
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions to Verify</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unverifiedPrescriptions.map((prescription) => (
            <div key={prescription.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{prescription.drugName}</h4>
                <p className="text-sm text-muted-foreground">
                  Patient: {prescription.patientWallet.slice(0, 10)}...
                </p>
                <p className="text-sm text-muted-foreground">
                  {prescription.quantity} tablets • {prescription.dosage}
                </p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant="secondary">Pending Verification</Badge>
                <div>
                  <Button onClick={() => handleVerify(prescription.id)} size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Prescription
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {unverifiedPrescriptions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No prescriptions to verify</p>
          )}
        </CardContent>
      </Card>

      {/* Verified Prescriptions History */}
      <Card>
        <CardHeader>
          <CardTitle>Verification History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifiedPrescriptions.map((prescription) => (
            <div key={prescription.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{prescription.drugName}</h4>
                <p className="text-sm text-muted-foreground">
                  Patient: {prescription.patientWallet.slice(0, 10)}...
                </p>
                <p className="text-sm text-muted-foreground">
                  {prescription.quantity} tablets • {prescription.dosage}
                </p>
              </div>
              <div className="text-right">
                <div className="flex gap-2">
                  <Badge variant="default">Verified</Badge>
                  <Badge variant={prescription.isPaid ? 'default' : 'outline'}>
                    {prescription.isPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {verifiedPrescriptions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No verified prescriptions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
