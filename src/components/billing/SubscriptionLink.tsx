
import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const SubscriptionLink = () => {
  return (
    <Link 
      to="/subscription" 
      className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
    >
      <CreditCard className="h-4 w-4" />
      <span>Subscription</span>
    </Link>
  );
};

export default SubscriptionLink;
