
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

interface PrescriberInfo {
  name: string;
  licenseNumber: string;
  s2Number?: string;
  ptrNumber?: string;
  signature: string;
}

interface PrescriberInfoCardProps {
  prescriberInfo: PrescriberInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PrescriberInfoCard: React.FC<PrescriberInfoCardProps> = ({
  prescriberInfo,
  onChange
}) => {
  return (
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
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="prescriberLicense">PRC License Number</Label>
          <Input 
            id="prescriberLicense" 
            name="licenseNumber" 
            value={prescriberInfo.licenseNumber || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="prescriberS2">S2 Number</Label>
          <Input 
            id="prescriberS2" 
            name="s2Number" 
            value={prescriberInfo.s2Number || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="prescriberPTR">PTR Number</Label>
          <Input 
            id="prescriberPTR" 
            name="ptrNumber" 
            value={prescriberInfo.ptrNumber || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="prescriberSignature">Signature</Label>
          <Input 
            id="prescriberSignature" 
            name="signature" 
            value={prescriberInfo.signature || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriberInfoCard;
