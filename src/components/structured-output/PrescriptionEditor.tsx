
import React, { useState } from 'react';
import { MedicalSections } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface PrescriptionEditorProps {
  structuredData: MedicalSections;
  onSave: (updatedData: MedicalSections) => void;
}

interface Medication {
  id?: number;
  name: string;
  strength: string;
  dosageForm: string;
  sigInstructions: string;
  quantity: string;
  refills: string;
  specialInstructions: string;
}

const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  structuredData,
  onSave,
}) => {
  // Extract only prescription-relevant data
  const [patientInfo, setPatientInfo] = useState(structuredData.patientInformation || {
    name: '',
    sex: '',
    age: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [medications, setMedications] = useState<Medication[]>(
    Array.isArray(structuredData.medications) 
      ? structuredData.medications.map((med, index) => ({
          id: med.id || index + 1,
          name: med.name || '',
          strength: med.strength || '',
          dosageForm: med.dosageForm || '',
          sigInstructions: med.sigInstructions || '',
          quantity: med.quantity || '',
          refills: med.refills || '',
          specialInstructions: med.specialInstructions || ''
        }))
      : []
  );
  
  const [prescriberInfo, setPrescriberInfo] = useState(structuredData.prescriberInformation || {
    name: '',
    licenseNumber: '',
    signature: ''
  });

  // Handle patient info changes
  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle medication changes
  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setMedications(updatedMedications);
  };
  
  // Add a new medication
  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        id: medications.length + 1,
        name: '',
        strength: '',
        dosageForm: '',
        sigInstructions: '',
        quantity: '',
        refills: '',
        specialInstructions: ''
      }
    ]);
  };
  
  // Remove a medication
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    
    // Update IDs to maintain sequential numbering
    const reindexedMedications = updatedMedications.map((med, idx) => ({
      ...med,
      id: idx + 1
    }));
    
    setMedications(reindexedMedications);
  };
  
  // Handle prescriber info changes
  const handlePrescriberInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriberInfo({
      ...prescriberInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission
  const handleSave = () => {
    const updatedData: MedicalSections = {
      ...structuredData,
      patientInformation: patientInfo,
      medications: medications,
      prescriberInformation: prescriberInfo
    };
    
    onSave(updatedData);
  };

  return (
    <div className="prescription-editor space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCircle className="h-5 w-5 mr-2" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input 
              id="patientName" 
              name="name" 
              value={patientInfo.name || ''} 
              onChange={handlePatientInfoChange} 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="patientSex">Sex/Gender</Label>
            <Input 
              id="patientSex" 
              name="sex" 
              value={patientInfo.sex || ''} 
              onChange={handlePatientInfoChange} 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="patientAge">Age</Label>
            <Input 
              id="patientAge" 
              name="age" 
              value={patientInfo.age || ''} 
              onChange={handlePatientInfoChange} 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="patientDate">Date</Label>
            <Input 
              id="patientDate" 
              name="date" 
              type="date" 
              value={patientInfo.date || ''} 
              onChange={handlePatientInfoChange} 
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Pill className="h-5 w-5 mr-2" />
            Medications
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMedication}
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
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Medication #{med.id}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveMedication(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`med-name-${index}`}>Medication Name</Label>
                    <Input 
                      id={`med-name-${index}`}
                      value={med.name} 
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-strength-${index}`}>Strength</Label>
                    <Input 
                      id={`med-strength-${index}`}
                      value={med.strength} 
                      onChange={(e) => handleMedicationChange(index, 'strength', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-dosage-${index}`}>Dosage Form</Label>
                    <Input 
                      id={`med-dosage-${index}`}
                      value={med.dosageForm} 
                      onChange={(e) => handleMedicationChange(index, 'dosageForm', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-quantity-${index}`}>Quantity</Label>
                    <Input 
                      id={`med-quantity-${index}`}
                      value={med.quantity} 
                      onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`med-sig-${index}`}>Sig Instructions</Label>
                    <Textarea 
                      id={`med-sig-${index}`}
                      value={med.sigInstructions} 
                      onChange={(e) => handleMedicationChange(index, 'sigInstructions', e.target.value)} 
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-refills-${index}`}>Refills</Label>
                    <Input 
                      id={`med-refills-${index}`}
                      value={med.refills} 
                      onChange={(e) => handleMedicationChange(index, 'refills', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`med-special-${index}`}>Special Instructions</Label>
                    <Textarea 
                      id={`med-special-${index}`}
                      value={med.specialInstructions} 
                      onChange={(e) => handleMedicationChange(index, 'specialInstructions', e.target.value)} 
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCircle className="h-5 w-5 mr-2" />
            Prescriber Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prescriberName">Prescriber Name</Label>
            <Input 
              id="prescriberName" 
              name="name" 
              value={prescriberInfo.name || ''} 
              onChange={handlePrescriberInfoChange} 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="prescriberLicense">License/Registration Number</Label>
            <Input 
              id="prescriberLicense" 
              name="licenseNumber" 
              value={prescriberInfo.licenseNumber || ''} 
              onChange={handlePrescriberInfoChange} 
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="prescriberSignature">Signature</Label>
            <Input 
              id="prescriberSignature" 
              name="signature" 
              value={prescriberInfo.signature || ''} 
              onChange={handlePrescriberInfoChange} 
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#33C3F0] hover:bg-[#33C3F0]/90">
          Save Prescription
        </Button>
      </div>
    </div>
  );
};

// Import missing components
import { UserCircle } from 'lucide-react';

export default PrescriptionEditor;
