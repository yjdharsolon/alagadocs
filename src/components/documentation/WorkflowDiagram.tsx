
import React from 'react';
import { Mic, FileText, Edit, Database } from 'lucide-react';

const WorkflowDiagram = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2 py-4">
      {/* Step 1 */}
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Mic className="h-8 w-8 text-primary" />
        </div>
        <span className="text-sm font-medium">Audio Input</span>
      </div>
      
      {/* Arrow */}
      <div className="hidden md:block text-muted-foreground">→</div>
      <div className="block md:hidden text-muted-foreground">↓</div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <span className="text-sm font-medium">Transcription</span>
      </div>
      
      {/* Arrow */}
      <div className="hidden md:block text-muted-foreground">→</div>
      <div className="block md:hidden text-muted-foreground">↓</div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Edit className="h-8 w-8 text-primary" />
        </div>
        <span className="text-sm font-medium">AI Structuring</span>
      </div>
      
      {/* Arrow */}
      <div className="hidden md:block text-muted-foreground">→</div>
      <div className="block md:hidden text-muted-foreground">↓</div>
      
      {/* Step 4 */}
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <span className="text-sm font-medium">EMR Integration</span>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
