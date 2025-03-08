
import React from 'react';
import { Check, CreditCard, Smartphone, Building } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBilling, PaymentMethod } from '@/hooks/useBilling';
import ProtectedRoute from '@/components/ProtectedRoute';
import CurrentSubscription from '@/components/billing/CurrentSubscription';

export default function BillingPage() {
  const {
    isProcessing,
    isLoading,
    selectedPlan,
    paymentMethod,
    billingPlans,
    currentSubscription,
    handlePlanSelection,
    handlePaymentMethodChange,
    processPayment
  } = useBilling();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Subscription Plans</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan for your needs. Upgrade or downgrade at any time.
              </p>
            </div>

            {/* Current Subscription */}
            {(currentSubscription || isLoading) && (
              <CurrentSubscription 
                subscription={currentSubscription}
                plans={billingPlans}
                onUpgrade={() => {}}
                isLoading={isLoading}
              />
            )}

            {/* Plans Selection */}
            <div className="grid md:grid-cols-3 gap-6">
              {billingPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative ${
                    selectedPlan?.id === plan.id 
                      ? 'border-2 border-primary shadow-lg' 
                      : 'border border-border'
                  } ${plan.isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {plan.isPopular && (
                    <Badge 
                      className="absolute -top-2 right-4" 
                      variant="default"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.transcriptionMinutes === -1 
                        ? 'Unlimited transcription' 
                        : `${plan.transcriptionMinutes} minutes of transcription`}
                    </CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handlePlanSelection(plan)}
                      variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                    >
                      {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Payment Section */}
            {selectedPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="card" onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}>
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
                            <input 
                              id="name" 
                              className="w-full p-2 border rounded" 
                              placeholder="John Smith"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card">Card Number</Label>
                            <input 
                              id="card" 
                              className="w-full p-2 border rounded" 
                              placeholder="4242 4242 4242 4242"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <input 
                              id="expiry" 
                              className="w-full p-2 border rounded" 
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="cvc">CVC</Label>
                            <input 
                              id="cvc" 
                              className="w-full p-2 border rounded" 
                              placeholder="123"
                            />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="zip">Zip Code</Label>
                            <input 
                              id="zip" 
                              className="w-full p-2 border rounded" 
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
                          <input 
                            id="mobile" 
                            className="w-full p-2 border rounded" 
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
                    onClick={processPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Complete Payment"}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            <div className="text-center text-sm text-muted-foreground">
              Need help? <a href="#" className="underline">Contact our support team</a>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
