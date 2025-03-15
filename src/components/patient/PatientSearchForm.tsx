
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';

interface PatientSearchFormProps {
  onSearchResults: (results: Patient[]) => void;
  userId: string | undefined;
}

export const PatientSearchForm: React.FC<PatientSearchFormProps> = ({ 
  onSearchResults, 
  userId 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a patient name or ID");
      return;
    }
    
    if (!userId) {
      toast.error("You must be logged in to search for patients");
      return;
    }
    
    setIsSearching(true);
    
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
      
      onSearchResults(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} patient(s) matching "${searchQuery}"`);
      } else {
        toast.error(`No patients found matching "${searchQuery}"`);
      }
    } catch (error: any) {
      console.error('Error searching for patients:', error);
      toast.error(error.message || 'An error occurred while searching for patients');
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
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
  );
};
