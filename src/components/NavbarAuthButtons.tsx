
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const NavbarAuthButtons = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <Button 
        onClick={signOut} 
        variant="ghost" 
        className="text-sm font-medium"
      >
        Sign Out
      </Button>
    );
  }

  return (
    <div className="flex gap-4">
      <Link to="/login">
        <Button variant="ghost" className="text-sm font-medium">
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button className="text-sm font-medium">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default NavbarAuthButtons;
