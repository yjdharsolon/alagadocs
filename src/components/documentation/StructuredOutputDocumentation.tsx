
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import WorkflowDiagram from './WorkflowDiagram';

const StructuredOutputDocumentation = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Structured Output</h2>
        <p className="text-muted-foreground">
          AlagaDocs transforms your audio recordings into structured medical notes that are ready for your EMR system.
          The structured output feature organizes transcribed content into standard medical sections following clinical documentation practices.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">Why use structured notes?</h3>
            <p className="text-blue-700 text-sm mt-1">
              Structured notes save time by organizing information in a standard format, making it easier to review patient information, 
              share with colleagues, and import into EMR systems. This improves both efficiency and documentation quality.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">How It Works</h3>
        <p className="text-muted-foreground">
          Our AI-powered system processes your dictation and intelligently organizes it into standard medical sections.
        </p>
        
        <WorkflowDiagram />
      </div>
      
      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Standard Sections</TabsTrigger>
          <TabsTrigger value="templates">Using Templates</TabsTrigger>
          <TabsTrigger value="export">Exporting Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections" className="space-y-4 pt-4">
          <h3 className="text-lg font-bold">Standard Medical Sections</h3>
          <p>AlagaDocs organizes your transcription into these standard medical sections:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Chief Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">The patient's primary reason for the visit, in their own words when possible.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">History of Present Illness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Chronological description of the development of the patient's illness.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Past Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Previous diseases, surgeries, treatments, and health conditions.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Current medications, dosages, and relevant medication history.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Clinical impressions, diagnoses, or differential diagnoses.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Treatment plans, additional testing, procedures, and follow-up instructions.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <h3 className="text-lg font-bold">Using Templates</h3>
          <p className="mb-4">
            Templates allow you to customize how your notes are structured based on your specialty or workflow preferences.
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Creating Templates</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Create custom templates with specialized sections for your clinical specialty. 
                You can add, remove, or reorder sections to match your documentation workflow.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Setting a Default Template</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Mark any template as your default, and it will be automatically applied to all new dictations.
                This streamlines your workflow for consistent documentation.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Applying Templates</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When editing a transcription, select any saved template from the dropdown menu to
                instantly reorganize your notes according to the template's structure.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4 pt-4">
          <h3 className="text-lg font-bold">Exporting Notes</h3>
          <p className="mb-4">AlagaDocs offers multiple ways to export your structured notes:</p>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Copy to Clipboard</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Quickly copy formatted notes to paste directly into your EMR system. The notes maintain their
                section structure for clean integration.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Export as PDF</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Download notes as a professionally formatted PDF document for your records
                or to share with colleagues through secure channels.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Save to Account</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Store notes in your AlagaDocs account for future reference, creating a
                searchable archive of your clinical documentation.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-bold mb-4">Tips for Better Results</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li>Speak clearly and at a moderate pace when recording your dictation</li>
          <li>Mention section headings in your dictation to help the AI properly categorize content</li>
          <li>Review and edit the transcription before structuring for optimal results</li>
          <li>Create specialty-specific templates for more accurate section organization</li>
          <li>Use the edit function to make manual adjustments to the structured output</li>
        </ul>
      </div>
    </div>
  );
};

export default StructuredOutputDocumentation;
