
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const roles = [
  {
    title: 'Doctor',
    description: 'Primary care physicians, specialists, and surgeons',
    icon: '👨‍⚕️'
  },
  {
    title: 'Nurse',
    description: 'Registered nurses, nurse practitioners, and nursing assistants',
    icon: '👩‍⚕️'
  },
  {
    title: 'Therapist',
    description: 'Physical therapists, occupational therapists, and speech therapists',
    icon: '🧑‍⚕️'
  },
  {
    title: 'Medical Assistant',
    description: 'Clinical and administrative medical assistants',
    icon: '💉'
  },
  {
    title: 'Transcriptionist',
    description: 'Medical transcription specialists',
    icon: '🎙️'
  },
  {
    title: 'Other',
    description: 'Other healthcare professionals',
    icon: '🏥'
  }
];

export default function RoleSelection() {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Select Your Role</h1>
          <p className="text-muted-foreground">
            Choose your role to help us personalize your experience with templates and workflows
            tailored to your specific needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-4xl mb-2">{role.icon}</div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">Select {role.title}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
