'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { simpleStore } from '@/src/lib/simple-store';
import { useMidnight } from '@/components/providers/midnight-provider';

interface PatientHomeProps {
  onNavigate: (tab: string) => void
  onStartPurchase: () => void
}

export function PatientHome({ onNavigate, onStartPurchase }: PatientHomeProps) {
  const { connect, isConnected, address } = useMidnight();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      const userPrescriptions = simpleStore.getPrescriptionsByPatient(address);
      setPrescriptions(userPrescriptions);
    }
  }, [address]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handlePay = async (prescriptionId: string) => {
    if (!isConnected || !address) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const txHash = `0x${Date.now().toString(16)}`;
      
      simpleStore.payPrescription(prescriptionId, txHash);
      
      const updated = simpleStore.getPrescriptionsByPatient(address);
      setPrescriptions(updated);
      
      alert(`Payment Successful!\nTransaction: ${txHash}`);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">Connect your wallet to view prescriptions</p>
            <Button onClick={handleConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activePrescriptions = prescriptions.filter(p => !p.isPaid);
  const totalPrescriptions = prescriptions.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Prescriptions</h1>
      
      {/* Prescriptions */}
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{prescription.drugName}</CardTitle>
                <Badge variant={prescription.isPaid ? 'default' : 'secondary'}>
                  {prescription.isPaid ? 'Paid' : 'Unpaid'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Quantity:</strong> {prescription.quantity}</p>
              <p><strong>Price:</strong> 50 tDust</p>
              {!prescription.isPaid && (
                <Button 
                  onClick={() => handlePay(prescription.id)} 
                  disabled={isLoading}
                  className="w-full mt-4"
                >
                  {isLoading ? 'Processing...' : 'Pay 50 tDust'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {prescriptions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No prescriptions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Prescriptions from your doctor will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
