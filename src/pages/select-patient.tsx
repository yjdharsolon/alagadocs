
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  patient_id?: string;
};

export default function SelectPatientPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a patient name or ID");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to search for patients");
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Search for patients in the database
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,patient_id.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSearchResults(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} patient(s) matching "${searchQuery}"`);
      } else {
        toast.error(`No patients found matching "${searchQuery}"`);
      }
    } catch (error: any) {
      console.error('Error searching for patients:', error);
      toast.error(error.message || 'An error occurred while searching for patients');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectPatient = (patient: Patient) => {
    // Store selected patient in session storage for use in next screens
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    toast.success(`Selected patient: ${patient.first_name} ${patient.last_name}`);
    
    // Navigate to upload as next step in workflow
    navigate('/upload');
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
            
            {hasSearched && (
              <div className="mt-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Search Results</h3>
                    <div className="border rounded-md divide-y">
                      {searchResults.map((patient) => (
                        <div 
                          key={patient.id} 
                          className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <div>
                            <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                            <p className="text-sm text-gray-500">
                              {patient.patient_id ? `ID: ${patient.patient_id}` : ''}
                              {patient.date_of_birth ? ` • DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}` : ''}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleSelectPatient(patient)}>
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md bg-gray-50">
                    <p className="text-gray-500">No patients found matching your search.</p>
                  </div>
                )}
              </div>
            )}
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
