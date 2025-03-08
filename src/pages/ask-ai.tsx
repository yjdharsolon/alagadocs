
import React from 'react';
import Layout from '@/components/Layout';
import AskAI from '@/components/AskAI';
import { Card } from '@/components/ui/card';
import { BrainCog, FileText, MessageCircle, Sparkles, User, ShieldCheck } from 'lucide-react';

const AskAIPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">AI Medical Assistant</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto">
          Get help with medical information or structure your medical notes using AI
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-4 flex flex-col items-center text-center">
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">Ask Medical Questions</h3>
            <p className="text-sm text-muted-foreground">
              Get answers to medical questions or explanations of concepts
            </p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center text-center">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">Structure Medical Text</h3>
            <p className="text-sm text-muted-foreground">
              Organize raw medical text into standard sections
            </p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center text-center">
            <BrainCog className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">Medical AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Specialized in healthcare terminology and concepts
            </p>
          </Card>
        </div>
        
        <AskAI />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Pro Tip</h3>
            </div>
            <p className="text-sm">
              For best results when structuring medical text, include key information like chief complaint, 
              history of present illness, and examination findings. The AI will organize your text into 
              standard medical note sections based on your role.
            </p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Privacy Note</h3>
            </div>
            <p className="text-sm">
              Your medical text is securely processed. We recommend removing patient identifiers before 
              submitting text for structuring. Saved notes are encrypted and only accessible by you.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AskAIPage;
