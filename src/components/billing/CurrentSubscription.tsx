
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, AlertTriangle } from 'lucide-react';
import { Subscription, BillingPlan } from '@/hooks/useBilling';
import { formatDate } from '@/utils/formatters';

type CurrentSubscriptionProps = {
  subscription: Subscription | null;
  plans: BillingPlan[];
  onUpgrade: () => void;
  isLoading: boolean;
};

const CurrentSubscription = ({ 
  subscription, 
  plans, 
  onUpgrade,
  isLoading 
}: CurrentSubscriptionProps) => {
  if (isLoading) {
    return (
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription</CardTitle>
          <CardDescription>Loading your subscription information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 rounded-md flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-700">
                You are currently using the free tier with limited features. 
                Subscribe to a plan to unlock more transcription minutes and features.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onUpgrade} className="w-full">
            Choose a Plan
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentPlan = plans.find(plan => plan.id === subscription.planId);
  
  if (!currentPlan) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Canceled</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Current Subscription</CardTitle>
            <CardDescription>Your active plan and details</CardDescription>
          </div>
          {getStatusBadge(subscription.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-medium text-lg">{currentPlan.name} Plan</h3>
            <p className="text-sm text-muted-foreground">
              ${currentPlan.price}/{currentPlan.currency} per month
            </p>
          </div>
          {currentPlan.isPopular && (
            <Badge variant="secondary">Popular Choice</Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Clock className="h-4 w-4" />
            <span>Subscribed since {formatDate(subscription.createdAt)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Clock className="h-4 w-4" />
            <span>Last updated on {formatDate(subscription.updatedAt)}</span>
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="font-medium mb-2">Plan Features:</h4>
          <ul className="space-y-1">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button onClick={onUpgrade} className="flex-1">
          Upgrade Plan
        </Button>
        {subscription.status === 'active' && (
          <Button variant="outline" className="flex-1">
            Cancel Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CurrentSubscription;
