
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameExtension, setNameExtension] = useState('');
  const [showExtensionSuggestions, setShowExtensionSuggestions] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signUp, loading, user } = useAuth();

  const nameExtensionSuggestions = ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !firstName || !lastName || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    
    try {
      await signUp(email, password, { 
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        name_extension: nameExtension
      });
      toast.success('Account created successfully!');
      navigate('/role-selection');
    } catch (error: any) {
      toast.error(error.message || 'Account creation failed');
    }
  };

  // Skip authentication check for now
  if (user && !loading) {
    return <Navigate to="/role-selection" />;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Enter your information to get started with AlagaDocs
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input 
                      id="middleName" 
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameExtension">Extension</Label>
                    <div className="relative">
                      <Input 
                        id="nameExtension" 
                        value={nameExtension}
                        onChange={(e) => setNameExtension(e.target.value)}
                        onFocus={() => setShowExtensionSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowExtensionSuggestions(false), 200)}
                        placeholder="Jr., Sr., etc."
                      />
                      {showExtensionSuggestions && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
                          {nameExtensionSuggestions.map((ext) => (
                            <div 
                              key={ext} 
                              className="px-4 py-2 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                setNameExtension(ext);
                                setShowExtensionSuggestions(false);
                              }}
                            >
                              {ext}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
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
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline hover:text-primary">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
