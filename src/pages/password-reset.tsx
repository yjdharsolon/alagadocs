
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Error sending password reset email');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "Check your email for a reset link" 
                : "Enter your email address and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          
          {isSubmitted ? (
            <CardContent className="space-y-4 text-center py-8">
              <div className="rounded-full bg-primary/10 p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                If an account exists for <span className="font-medium">{email}</span>, 
                you will receive an email with instructions to reset your password.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or try again with a different email.
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </Layout>
  );
}
