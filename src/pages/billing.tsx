
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Wallet, RefreshCw, Lock, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PlanOption {
  id: string;
  name: string;
  price: number;
  frequency: string;
  features: string[];
  description: string;
  popular?: boolean;
  minutes: number;
}

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingTab, setBillingTab] = useState('monthly');
  
  const plans: Record<string, PlanOption[]> = {
    monthly: [
      {
        id: 'basic-monthly',
        name: 'Basic',
        price: 19.99,
        frequency: 'month',
        minutes: 60,
        description: 'Perfect for occasional use',
        features: [
          '60 minutes of transcription per month',
          'AI-powered text structuring',
          'Basic templates',
          'Email support'
        ]
      },
      {
        id: 'pro-monthly',
        name: 'Professional',
        price: 49.99,
        frequency: 'month',
        minutes: 200,
        description: 'Ideal for regular clinical use',
        popular: true,
        features: [
          '200 minutes of transcription per month',
          'Advanced AI structuring',
          'Unlimited custom templates',
          'Priority support',
          'Medical terminology customization'
        ]
      },
      {
        id: 'enterprise-monthly',
        name: 'Enterprise',
        price: 99.99,
        frequency: 'month',
        minutes: 500,
        description: 'For high-volume practices',
        features: [
          '500 minutes of transcription per month',
          'All Professional features',
          'Multi-provider accounts',
          'Advanced analytics',
          'Dedicated account manager',
          'HIPAA compliance assistance'
        ]
      }
    ],
    yearly: [
      {
        id: 'basic-yearly',
        name: 'Basic',
        price: 199.99,
        frequency: 'year',
        minutes: 60,
        description: 'Perfect for occasional use (Save 17%)',
        features: [
          '60 minutes of transcription per month',
          'AI-powered text structuring',
          'Basic templates',
          'Email support'
        ]
      },
      {
        id: 'pro-yearly',
        name: 'Professional',
        price: 499.99,
        frequency: 'year',
        minutes: 200,
        description: 'Ideal for regular clinical use (Save 17%)',
        popular: true,
        features: [
          '200 minutes of transcription per month',
          'Advanced AI structuring',
          'Unlimited custom templates',
          'Priority support',
          'Medical terminology customization'
        ]
      },
      {
        id: 'enterprise-yearly',
        name: 'Enterprise',
        price: 999.99,
        frequency: 'year',
        minutes: 500,
        description: 'For high-volume practices (Save 16%)',
        features: [
          '500 minutes of transcription per month',
          'All Professional features',
          'Multi-provider accounts',
          'Advanced analytics',
          'Dedicated account manager',
          'HIPAA compliance assistance'
        ]
      }
    ]
  };
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Subscription activated successfully!');
      // In a real app, redirect to a success page or dashboard
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
              <p className="text-muted-foreground">
                Choose the plan that's right for your practice
              </p>
            </div>
            
            <Tabs 
              defaultValue="monthly" 
              value={billingTab}
              onValueChange={setBillingTab}
              className="w-full mb-8"
            >
              <div className="flex justify-center">
                <TabsList className="mb-4">
                  <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                  <TabsTrigger value="yearly">Annual Billing (Save up to 17%)</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="monthly" className="space-y-8 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.monthly.map(plan => (
                    <Card 
                      key={plan.id} 
                      className={`relative overflow-hidden ${plan.popular ? 'border-primary shadow-md' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
                          Most Popular
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.frequency}</span>
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="bg-primary/5">
                            {plan.minutes} minutes/month
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => handleSelectPlan(plan.id)} 
                          className="w-full"
                          variant={selectedPlan === plan.id ? "default" : "outline"}
                        >
                          {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="yearly" className="space-y-8 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.yearly.map(plan => (
                    <Card 
                      key={plan.id} 
                      className={`relative overflow-hidden ${plan.popular ? 'border-primary shadow-md' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
                          Most Popular
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.frequency}</span>
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="bg-primary/5">
                            {plan.minutes} minutes/month
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => handleSelectPlan(plan.id)} 
                          className="w-full"
                          variant={selectedPlan === plan.id ? "default" : "outline"}
                        >
                          {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {selectedPlan && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Your subscription will begin immediately after payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="font-medium">Payment Options</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="bg-white border rounded px-2 py-1">
                            <span className="text-xs font-medium">Credit Card</span>
                          </div>
                          <div className="bg-white border rounded px-2 py-1">
                            <span className="text-xs font-medium">Paymaya</span>
                          </div>
                          <div className="bg-white border rounded px-2 py-1">
                            <span className="text-xs font-medium">GCash</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mock payment form (for demo purposes) */}
                      <div className="bg-white border rounded-md p-4">
                        <div className="text-center text-muted-foreground mb-4">
                          <Lock className="h-5 w-5 mx-auto mb-2" />
                          <p className="text-sm">
                            This is a demo. In a real application, a secure payment form would be displayed here.
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3">
                          <div className="bg-gray-100 rounded p-2">
                            <DollarSign className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="bg-gray-100 rounded p-2">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="bg-gray-100 rounded p-2">
                            <Wallet className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4 border-t">
                      <div>
                        <p className="font-medium">Total</p>
                        <p className="text-muted-foreground text-sm">
                          {billingTab === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          ${selectedPlan && plans[billingTab].find(p => p.id === selectedPlan)?.price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      <span>Cancel anytime</span>
                    </div>
                    <Button 
                      onClick={handleSubscribe} 
                      disabled={isProcessing}
                      className="flex items-center gap-1"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Complete Purchase
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium mb-2">Questions? We're here to help.</h3>
              <p className="text-muted-foreground">
                Contact our team at <span className="text-primary">support@alagadocs.com</span>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
