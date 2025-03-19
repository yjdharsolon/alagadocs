
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

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

interface MedicationCardProps {
  medication: Medication;
  index: number;
  onFieldChange: (index: number, field: keyof Medication, value: string) => void;
  onRemove: (index: number) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  index,
  onFieldChange,
  onRemove
}) => {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Medication #{medication.id || index + 1}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`med-generic-${index}`}>Generic Name *</Label>
          <Input 
            id={`med-generic-${index}`}
            value={medication.genericName} 
            onChange={(e) => onFieldChange(index, 'genericName', e.target.value)} 
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor={`med-brand-${index}`}>Brand Name (Optional)</Label>
          <Input 
            id={`med-brand-${index}`}
            value={medication.brandName || ''} 
            onChange={(e) => onFieldChange(index, 'brandName', e.target.value)} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`med-strength-${index}`}>Strength</Label>
          <Input 
            id={`med-strength-${index}`}
            value={medication.strength || ''} 
            onChange={(e) => onFieldChange(index, 'strength', e.target.value)} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`med-dosage-${index}`}>Dosage Form</Label>
          <Input 
            id={`med-dosage-${index}`}
            value={medication.dosageForm || ''} 
            onChange={(e) => onFieldChange(index, 'dosageForm', e.target.value)} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`med-quantity-${index}`}>Quantity</Label>
          <Input 
            id={`med-quantity-${index}`}
            value={medication.quantity || ''} 
            onChange={(e) => onFieldChange(index, 'quantity', e.target.value)} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`med-refills-${index}`}>Refills</Label>
          <Input 
            id={`med-refills-${index}`}
            value={medication.refills || ''} 
            onChange={(e) => onFieldChange(index, 'refills', e.target.value)} 
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`med-sig-${index}`}>Sig Instructions</Label>
          <Textarea 
            id={`med-sig-${index}`}
            value={medication.sigInstructions || ''} 
            onChange={(e) => onFieldChange(index, 'sigInstructions', e.target.value)} 
            className="mt-1"
            rows={2}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`med-special-${index}`}>Special Instructions</Label>
          <Textarea 
            id={`med-special-${index}`}
            value={medication.specialInstructions || ''} 
            onChange={(e) => onFieldChange(index, 'specialInstructions', e.target.value)} 
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
