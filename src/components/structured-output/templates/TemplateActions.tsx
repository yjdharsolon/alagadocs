
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus } from 'lucide-react';

interface TemplateActionsProps {
  activeTab: string;
  onCreateNew: () => void;
}

const TemplateActions = ({ activeTab, onCreateNew }: TemplateActionsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Templates</h1>
        </div>
        
        <div>
          {activeTab === 'view' && (
            <Button 
              onClick={onCreateNew}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          )}
        </div>
      </div>
      
      <Separator className="mb-6" />
    </>
  );
};

export default TemplateActions;
