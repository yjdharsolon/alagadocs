
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
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if the user is authenticated via recovery token
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        toast.error('Password reset link is invalid or has expired');
        navigate('/password-reset');
        return;
      }
      
      setUser(data.user);
    };

    checkUser();
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate password
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Password updated successfully');
      
      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      toast.error(error.message || 'Error updating password');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isSuccess ? 'Password Updated' : 'Update Your Password'}
            </CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Your password has been updated successfully" 
                : "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-4 text-center py-8">
              <div className="rounded-full bg-green-100 p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                You will be redirected to the login page shortly.
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
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
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
