'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { simpleStore } from '@/src/lib/simple-store';
import { useMidnight } from '@/components/providers/midnight-provider';


export function PayPrescription() {
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
      // Try real Midnight wallet first
      const midnight = (window as any).midnight;
      let txHash;
      
      if (midnight?.mnLace) {
        const api = await midnight.mnLace.enable();
        
        // Create transfer using wallet SDK
        const transferRecipe = await api.transferTransaction([{
          amount: 50,
          type: { tag: 'native' },
          receiverAddress: 'mn_shield-addr_test1gpztte8j9ww3tpyjcq6dg3pv6zveq029ncfx8ashlc0992x2agyqxq8ae4s9sumzaxlmyxwyxkutcftu70kazfrrx00twndcr8euwwr3h5zpz8v9'
        }]);
        
        const provenTx = await api.proveTransaction(transferRecipe);
        txHash = await api.submitTransaction(provenTx);
      } else {
        // Mock payment fallback
        await new Promise(resolve => setTimeout(resolve, 2000));
        txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
      }
      
      // Generate proof hash from transaction
      const proofHash = txHash;
      
      // Update prescription as paid
      simpleStore.payPrescription(prescriptionId, proofHash);
      
      // Refresh prescriptions
      const updated = simpleStore.getPrescriptionsByPatient(address);
      setPrescriptions(updated);
      
      console.log(`Mock payment: Paid for prescription ${prescriptionId} with tx ${txHash}`);
      alert(`Mock Payment Successful!\nTransaction: ${txHash}\nAmount: 50 tDust`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">My Prescriptions</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">Connect your Midnight wallet to view prescriptions</p>
            <Button onClick={handleConnect}>Connect Midnight Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Prescriptions</h2>
      {prescriptions.map((prescription) => (
        <Card key={prescription.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{prescription.drugName}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={prescription.isVerified ? 'default' : 'secondary'}>
                  {prescription.isVerified ? 'Verified' : 'Pending Verification'}
                </Badge>
                {prescription.isVerified && (
                  <Badge variant={prescription.isPaid ? 'default' : 'outline'}>
                    {prescription.isPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Dosage:</strong> {prescription.dosage}</p>
            <p><strong>Quantity:</strong> {prescription.quantity}</p>
            <p><strong>Price:</strong> 50 tDust</p>
            {!prescription.isVerified && (
              <div className="mt-4 p-2 bg-yellow-50 rounded">
                <p className="text-sm text-yellow-700">
                  Please visit the pharmacy to verify this prescription before payment.
                </p>
              </div>
            )}
            {prescription.isVerified && !prescription.isPaid && (
              <Button 
                onClick={() => handlePay(prescription.id)} 
                disabled={isLoading}
                className="w-full mt-4"
              >
                {isLoading ? 'Processing Payment...' : 'Pay 50 tDust with Midnight'}
              </Button>
            )}
            {prescription.isPaid && (
              <div className="mt-4 p-2 bg-green-50 rounded">
                <p className="text-sm text-green-700">
                  <strong>Proof Hash:</strong> {prescription.proofHash}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {prescriptions.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No prescriptions found</p>
      )}
    </div>
  );
}