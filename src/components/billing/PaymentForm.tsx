
import React from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PaymentMethod } from '@/hooks/useBilling';
import { BillingPlan } from '@/hooks/useBilling';

interface PaymentFormProps {
  selectedPlan: BillingPlan;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export default function PaymentForm({ 
  selectedPlan, 
  paymentMethod, 
  onPaymentMethodChange, 
  onSubmit, 
  isProcessing 
}: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Select your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="card">Credit Card</TabsTrigger>
            <TabsTrigger value="gcash">GCash/Paymaya</TabsTrigger>
            <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card">Card Number</Label>
                  <Input 
                    id="card" 
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input 
                    id="cvc" 
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input 
                    id="zip" 
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gcash">
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded flex items-center space-x-4">
                <Smartphone className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Mobile Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll be redirected to GCash or Paymaya to complete payment
                  </p>
                </div>
              </div>
              
              <RadioGroup defaultValue="gcash">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gcash" id="gcash" />
                  <Label htmlFor="gcash">GCash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paymaya" id="paymaya" />
                  <Label htmlFor="paymaya">Paymaya</Label>
                </div>
              </RadioGroup>
              
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input 
                  id="mobile" 
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bank_transfer">
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded flex items-center space-x-4">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Bank Transfer</h3>
                  <p className="text-sm text-muted-foreground">
                    Transfer directly to our bank account
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bank Name:</span>
                  <span className="font-medium">Philippines National Bank</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Name:</span>
                  <span className="font-medium">AlagaDocs Inc.</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Number:</span>
                  <span className="font-medium">1234-5678-9012-3456</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Reference:</span>
                  <span className="font-medium">ALD-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                Please include your reference code in your transfer details so we can identify your payment.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            You'll be charged ${selectedPlan.price} monthly
          </p>
        </div>
        <Button 
          onClick={onSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
