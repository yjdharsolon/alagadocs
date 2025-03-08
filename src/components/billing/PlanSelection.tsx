
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BillingPlan } from '@/hooks/useBilling';

interface PlanSelectionProps {
  plans: BillingPlan[];
  selectedPlan: BillingPlan | null;
  onSelectPlan: (plan: BillingPlan) => void;
}

export default function PlanSelection({ plans, selectedPlan, onSelectPlan }: PlanSelectionProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
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
              onClick={() => onSelectPlan(plan)}
              variant={selectedPlan?.id === plan.id ? "default" : "outline"}
            >
              {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
