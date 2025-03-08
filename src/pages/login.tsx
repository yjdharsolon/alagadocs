
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook, loading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      await signIn(email, password, rememberMe);
    } catch (error: any) {
      console.error('Login error:', error);
      // Error is already handled in the useAuth hook
    }
  };

  // Skip authentication check for now - we'll redirect if user is already signed in
  if (user && !loading) {
    return <Navigate to="/role-selection" />;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen py-10 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to AlagaDocs</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="doctor@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/password-reset" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              
              <Button 
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => signInWithGoogle()}
                  disabled={loading}
                  className="w-full"
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => signInWithFacebook()}
                  disabled={loading}
                  className="w-full"
                >
                  <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
              </div>
            </CardContent>
          </form>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="underline hover:text-primary">
                Sign up
              </Link>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
