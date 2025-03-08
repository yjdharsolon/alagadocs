
import React from 'react';
import Layout from '@/components/Layout';
import StructuredOutputDocumentation from '@/components/documentation/StructuredOutputDocumentation';

export default function Documentation() {
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">AlagaDocs Documentation</h1>
          <StructuredOutputDocumentation />
        </div>
      </div>
    </Layout>
  );
}
