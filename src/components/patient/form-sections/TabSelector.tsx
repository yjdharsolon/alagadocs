
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabSelectorProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="px-6">
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full border border-[#E0E0E0] rounded-md p-1">
          <TabsTrigger 
            value="personal" 
            className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
          >
            Personal Information
          </TabsTrigger>
          <TabsTrigger 
            value="emergency" 
            className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
          >
            Emergency Contact
          </TabsTrigger>
          <TabsTrigger 
            value="medical" 
            className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
          >
            Medical Information
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
