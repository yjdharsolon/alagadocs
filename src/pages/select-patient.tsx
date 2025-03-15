
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function SelectPatientPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // This would typically fetch patients from your backend
  // For now, we'll use a placeholder implementation
  const handleSearchPatient = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search patients and display results
    // For now, just navigate to upload as a next step in workflow
    navigate('/upload');
  };
  
  const handleCreatePatient = () => {
    // In a real app, this would open a form to create a new patient
    // For now, just navigate to upload as a next step in workflow
    navigate('/upload');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Select Patient</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Patient</CardTitle>
            <CardDescription>
              Search for an existing patient by name or ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearchPatient} className="flex gap-2">
              <Input 
                placeholder="Search patients..." 
                className="flex-1"
                aria-label="Search patients"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>No Patient Found?</CardTitle>
            <CardDescription>
              Register a new patient to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreatePatient} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Register New Patient
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
