
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, PlusCircle } from 'lucide-react';
import MedicationCard from './MedicationCard';
import { Medication } from './types/prescriptionTypes';

interface MedicationsSectionProps {
  medications: Medication[];
  onMedicationChange: (index: number, field: keyof Medication, value: string) => void;
  onAddMedication: () => void;
  onRemoveMedication: (index: number) => void;
  onSave: (e: React.MouseEvent) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({
  medications,
  onMedicationChange,
  onAddMedication,
  onRemoveMedication,
  onSave
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Medications</CardTitle>
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            className="h-8 gap-1" 
            onClick={onSave}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Medications</span>
          </Button>
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            className="h-8 gap-1" 
            onClick={onAddMedication}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Medication</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No medications added. Click "Add Medication" to begin.
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <MedicationCard 
                key={index} 
                medication={medication} 
                index={index}
                onChange={onMedicationChange}
                onRemove={onRemoveMedication}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationsSection;
