
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ListChecks, ClipboardCheck, Edit, Book } from 'lucide-react';
import WorkflowDiagram from './WorkflowDiagram';

const StructuredOutputDocumentation = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Structured Medical Notes
          </CardTitle>
          <CardDescription>
            Convert your transcriptions into organized, professional medical documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Structured Output is a core feature of AlagaDocs that transforms your audio transcriptions 
            into well-organized medical notes, automatically formatted according to medical 
            documentation standards.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Key Benefits</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Automatic organization of transcribed text into professional medical sections</li>
            <li>Customizable templates to match your documentation preferences</li>
            <li>Easy editing and refinement of the structured content</li>
            <li>Simple export options for integration with EMR systems</li>
            <li>Time-saving through elimination of manual formatting</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowDiagram />
          
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                Audio Transcription
              </h3>
              <p className="text-muted-foreground pl-8">
                Upload or record your audio file and get it transcribed into text using our AI-powered transcription engine.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                AI-Powered Structuring
              </h3>
              <p className="text-muted-foreground pl-8">
                Our advanced AI analyzes the transcription and intelligently categorizes the content into standard medical sections.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                Review & Edit
              </h3>
              <p className="text-muted-foreground pl-8">
                Review the structured output and make any necessary edits or refinements to ensure accuracy.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">4</span>
                Export & Integration
              </h3>
              <p className="text-muted-foreground pl-8">
                Copy the structured notes to your clipboard or export them for seamless integration with your existing EMR system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sections">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Standard Sections</TabsTrigger>
          <TabsTrigger value="templates">Using Templates</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Standard Medical Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                By default, AlagaDocs structures your transcriptions into these standard medical note sections:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Chief Complaint</h4>
                  <p className="text-sm text-muted-foreground">The primary reason for the patient's visit in their own words.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">History of Present Illness</h4>
                  <p className="text-sm text-muted-foreground">A chronological description of the development of the patient's illness.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Past Medical History</h4>
                  <p className="text-sm text-muted-foreground">Previous significant medical conditions, surgeries, and treatments.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Medications</h4>
                  <p className="text-sm text-muted-foreground">Current medications, dosages, and frequencies.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Allergies</h4>
                  <p className="text-sm text-muted-foreground">Known allergies and adverse reactions.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Physical Examination</h4>
                  <p className="text-sm text-muted-foreground">Findings from the physical examination of the patient.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Assessment</h4>
                  <p className="text-sm text-muted-foreground">Diagnosis or clinical impression based on the evaluation.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Plan</h4>
                  <p className="text-sm text-muted-foreground">Treatment recommendations, follow-up instructions, and referrals.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Using Custom Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                AlagaDocs allows you to create and use custom templates to structure your medical notes according to your specific needs.
              </p>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Working with Templates</h3>
              <ol className="list-decimal pl-5 space-y-3 text-muted-foreground">
                <li>
                  <strong>Create a Template:</strong> Navigate to the Templates page from your dashboard and create a new template with your preferred sections.
                </li>
                <li>
                  <strong>Set a Default Template:</strong> Mark any template as your default to automatically apply it to all new transcriptions.
                </li>
                <li>
                  <strong>Apply to Transcriptions:</strong> When viewing a transcription, select from your saved templates to restructure the content accordingly.
                </li>
                <li>
                  <strong>Modify Templates:</strong> Update your templates at any time to accommodate changing documentation requirements.
                </li>
              </ol>
              
              <p className="mt-4 text-muted-foreground">
                Templates are particularly useful for different specialties or documentation scenarios, enabling consistent formatting across all your medical notes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Export & Integration Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Once your medical notes are structured, AlagaDocs offers several options for exporting and using your documentation:
              </p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-medium">Copy to Clipboard</h4>
                  <p className="text-sm text-muted-foreground">Quickly copy the formatted text to paste directly into your EMR system.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Export as PDF</h4>
                  <p className="text-sm text-muted-foreground">Save your notes as a PDF document for printing or electronic storage.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Save to Your Account</h4>
                  <p className="text-sm text-muted-foreground">Store structured notes in your AlagaDocs account for future reference.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Edit Before Export</h4>
                  <p className="text-sm text-muted-foreground">Make final adjustments to any section before exporting your documentation.</p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-6">
                <h4 className="font-medium mb-2">Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  For the most efficient workflow, use keyboard shortcuts: Ctrl+C (or Cmd+C) to copy after selecting the copy button, and then Ctrl+V (or Cmd+V) to paste directly into your EMR system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StructuredOutputDocumentation;
