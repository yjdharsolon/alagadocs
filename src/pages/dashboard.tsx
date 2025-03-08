
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import SavedNotes from '@/components/dashboard/SavedNotes';
import TemplateManager from '@/components/templates/TemplateManager';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('notes');

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
          
          <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="notes">Saved Notes</TabsTrigger>
              <TabsTrigger value="templates">Custom Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="min-h-[400px]">
              <SavedNotes />
            </TabsContent>
            
            <TabsContent value="templates" className="min-h-[400px]">
              <TemplateManager />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
