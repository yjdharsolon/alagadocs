
import React from 'react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';

interface PatientSearchResultsProps {
  searchResults: Patient[];
  hasSearched: boolean;
  onSelectPatient: (patient: Patient) => void;
}

export const PatientSearchResults: React.FC<PatientSearchResultsProps> = ({
  searchResults,
  hasSearched,
  onSelectPatient
}) => {
  if (!hasSearched) {
    return null;
  }

  return (
    <div className="mt-4">
      {searchResults.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Search Results</h3>
          <div className="border rounded-md divide-y">
            {searchResults.map((patient) => (
              <div 
                key={patient.id} 
                className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => onSelectPatient(patient)}
              >
                <div>
                  <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                  <p className="text-sm text-gray-500">
                    {patient.patient_id ? `ID: ${patient.patient_id}` : ''}
                    {patient.date_of_birth ? ` • DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <Button size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onSelectPatient(patient);
                }}>
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
  );
};
