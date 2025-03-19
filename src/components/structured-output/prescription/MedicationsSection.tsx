
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Pill, Plus } from 'lucide-react';
import MedicationCard from './MedicationCard';

interface Medication {
  id?: number;
  genericName: string;
  brandName: string;
  strength: string;
  dosageForm: string;
  sigInstructions: string;
  quantity: string;
  refills: string;
  specialInstructions: string;
}

interface MedicationsSectionProps {
  medications: Medication[];
  onMedicationChange: (index: number, field: keyof Medication, value: string) => void;
  onAddMedication: () => void;
  onRemoveMedication: (index: number) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({
  medications,
  onMedicationChange,
  onAddMedication,
  onRemoveMedication
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Pill className="h-5 w-5 mr-2" />
          Medications
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddMedication}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {medications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No medications. Add a medication using the button above.
          </div>
        ) : (
          medications.map((med, index) => (
            <MedicationCard
              key={index}
              medication={med}
              index={index}
              onFieldChange={onMedicationChange}
              onRemove={onRemoveMedication}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationsSection;
