
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
  const { user, getUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user already has a role
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const role = await getUserRole();
          if (role) {
            setSelectedRole(role);
          }
          setInitialLoading(false);
        } catch (error) {
          console.error('Error checking user role:', error);
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };

    checkUserRole();
  }, [user, getUserRole]);

  const handleRoleSelection = async (role: string) => {
    if (!user) return;

    setLoading(true);
    setSelectedRole(role);

    try {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      let error;

      if (existingRole) {
        // Update existing role
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
        
        error = updateError;
      } else {
        // Insert new role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role });
        
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast.success(`Role set to ${role}`);
      
      // Navigate to the upload page to start the transcription process
      setTimeout(() => {
        navigate('/upload');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set role');
      console.error('Error setting role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Select Your Role</h1>
          <p className="text-muted-foreground">
            Choose your role to help us personalize your experience with templates and workflows
            tailored to your specific needs.
          </p>
          {selectedRole && (
            <div className="mt-4 p-2 bg-green-50 text-green-800 rounded-md">
              Current role: <strong>{selectedRole}</strong>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedRole === role.title ? 'border-primary border-2' : ''
              }`}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{role.icon}</div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleRoleSelection(role.title)}
                  disabled={loading}
                >
                  {loading && selectedRole === role.title ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Role...
                    </>
                  ) : (
                    `Select ${role.title}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
