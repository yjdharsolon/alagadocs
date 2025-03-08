
import React from 'react';
import Layout from '@/components/Layout';
import AskAI from '@/components/AskAI';

const AskAIPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">AI Assistant</h1>
        <AskAI />
      </div>
    </Layout>
  );
};

export default AskAIPage;
