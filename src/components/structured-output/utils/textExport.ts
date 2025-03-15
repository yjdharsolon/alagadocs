
import { MedicalSections } from '../types';
import toast from 'react-hot-toast';

export const exportAsText = (sections: MedicalSections) => {
  const blob = new Blob(
    [
      `MEDICAL DOCUMENTATION
      
CHIEF COMPLAINT:
${sections?.chiefComplaint || 'None documented'}

HISTORY OF PRESENT ILLNESS:
${sections?.historyOfPresentIllness || 'None documented'}

PAST MEDICAL HISTORY:
${sections?.pastMedicalHistory || 'None documented'}

MEDICATIONS:
${sections?.medications || 'None documented'}

ALLERGIES:
${sections?.allergies || 'None documented'}

PHYSICAL EXAMINATION:
${sections?.physicalExamination || 'None documented'}

ASSESSMENT:
${sections?.assessment || 'None documented'}

PLAN:
${sections?.plan || 'None documented'}
      `
    ], 
    { type: 'text/plain' }
  );
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medical_note_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
  toast.success('Document exported as text file (fallback mode)');
};
