
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function SelectPatientPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // This would typically fetch patients from your backend
  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a patient name or ID");
      return;
    }
    
    setIsSearching(true);
    try {
      // In a real app, this would search for patients in the database
      // For now, we'll simulate a search and navigate to upload
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Mock patient found - in a real implementation, this would check the database
      const patientFound = searchQuery.toLowerCase().includes('test');
      
      if (patientFound) {
        toast.success(`Patient "${searchQuery}" found! Starting consultation.`);
        
        // Navigate to upload as next step in workflow
        setTimeout(() => {
          navigate('/upload');
        }, 1000);
      } else {
        toast.error(`No patient found with name or ID "${searchQuery}"`);
      }
    } catch (error) {
      console.error('Error searching for patient:', error);
      toast.error('An error occurred while searching for the patient');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleCreatePatient = () => {
    // Navigate to the patient registration page
    navigate('/register-patient');
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
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
