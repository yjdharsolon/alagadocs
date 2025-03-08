
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if the user is authenticated via the recovery flow
  useEffect(() => {
    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('Invalid or expired recovery link. Please try again.');
        navigate('/password-reset');
      }
    };
    
    checkRecoverySession();
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Password updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating password');
      console.error('Update password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Your password has been updated successfully" 
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-4 text-center py-8">
              <div className="rounded-full bg-green-100 p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                Your password has been updated successfully.
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password" 
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? 'Updating Password...' : 'Update Password'}
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
