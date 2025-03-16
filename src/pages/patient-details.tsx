import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientDisplayCard } from '@/components/upload/PatientDisplayCard';
import { Patient } from '@/types/patient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserStructuredNotes } from '@/services/structuredNoteService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Stethoscope, File, Loader2, Edit, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function PatientDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);
  
  const searchParams = new URLSearchParams(location.search);
  const patientIdFromUrl = searchParams.get('id');

  useEffect(() => {
    const patientFromState = location.state?.patient;
    const patientFromStorage = sessionStorage.getItem('selectedPatient');
    
    if (patientFromState) {
      setPatient(patientFromState);
      sessionStorage.setItem('selectedPatient', JSON.stringify(patientFromState));
    } else if (patientFromStorage) {
      setPatient(JSON.parse(patientFromStorage));
    } else if (patientIdFromUrl) {
      const fetchPatientById = async () => {
        try {
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientIdFromUrl)
            .single();
            
          if (error) throw error;
          if (data) {
            setPatient(data);
            sessionStorage.setItem('selectedPatient', JSON.stringify(data));
          } else {
            toast.error('Patient not found');
            navigate('/select-patient');
          }
        } catch (error: any) {
          console.error('Error fetching patient:', error);
          toast.error('Failed to load patient data');
          navigate('/select-patient');
        }
      };
      
      fetchPatientById();
    } else {
      toast.error('No patient selected');
      navigate('/select-patient');
    }
  }, [location.state, navigate, patientIdFromUrl]);

  useEffect(() => {
    async function fetchPatientNotes() {
      if (!patient?.id) return;
      
      try {
        setLoading(true);
        console.log('Fetching notes for patient ID:', patient.id);
        const notes = await getUserStructuredNotes();
        console.log('All notes fetched:', notes);
        
        const filtered = notes.filter(note => {
          console.log('Note patient_id:', note.patient_id, 'Patient id:', patient.id);
          return note.patient_id === patient.id;
        });
        
        console.log('Filtered patient notes:', filtered);
        setPatientNotes(filtered);
      } catch (error) {
        console.error('Error fetching patient notes:', error);
        toast.error('Failed to load patient records');
      } finally {
        setLoading(false);
      }
    }

    fetchPatientNotes();
  }, [patient]);

  const handleStartConsultation = () => {
    navigate('/upload', { 
      state: { 
        patient: patient 
      } 
    });
  };

  const handleViewNote = (noteId: string) => {
    navigate(`/structured-output?noteId=${noteId}`);
  };

  const handleEditPatient = () => {
    navigate(`/edit-patient?id=${patient?.id}`);
  };

  const handleBack = () => {
    navigate('/select-patient');
  };

  if (!patient) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handleBack}>
            Back to Patient Search
          </Button>
          <h1 className="text-2xl font-bold">Patient Details</h1>
          <div className="w-[100px]"></div>
        </div>

        <PatientDisplayCard 
          patient={patient} 
          onChangePatient={handleBack}
        />

        <Tabs defaultValue="records" className="mt-6">
          <TabsList>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="info">Patient Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medical Records</CardTitle>
                <Button onClick={handleStartConsultation}>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Start New Consultation
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : patientNotes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientNotes.map((note) => {
                        const sections = note.content || {};
                        const firstSection = Object.values(sections)[0] as string || '';
                        const preview = firstSection.substring(0, 60) + (firstSection.length > 60 ? '...' : '');
                        
                        return (
                          <TableRow key={note.id}>
                            <TableCell>
                              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                            </TableCell>
                            <TableCell>{preview || 'No content'}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewNote(note.id)}
                              >
                                <File className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No medical records available for this patient.</p>
                    <Button 
                      onClick={handleStartConsultation} 
                      variant="outline" 
                      className="mt-2"
                    >
                      Create First Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Patient Information</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={handleEditPatient}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <UserRound className="h-5 w-5 mr-2 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p>{patient.first_name} {patient.last_name}</p>
                      </div>
                      {patient.date_of_birth && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                          <p>{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {patient.age && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Age</p>
                          <p>{patient.age}</p>
                        </div>
                      )}
                      {patient.gender && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Gender</p>
                          <p>{patient.gender}</p>
                        </div>
                      )}
                      {patient.civil_status && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Civil Status</p>
                          <p>{patient.civil_status}</p>
                        </div>
                      )}
                      {patient.nationality && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                          <p>{patient.nationality}</p>
                        </div>
                      )}
                      {patient.blood_type && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                          <p>{patient.blood_type}</p>
                        </div>
                      )}
                      {patient.patient_id && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                          <p>{patient.patient_id}</p>
                        </div>
                      )}
                      {patient.email && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p>{patient.email}</p>
                        </div>
                      )}
                      {patient.phone && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <p>{patient.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
                    <div>
                      <h3 className="text-lg font-medium">Emergency Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {patient.emergency_contact_name && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p>{patient.emergency_contact_name}</p>
                          </div>
                        )}
                        {patient.emergency_contact_relationship && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                            <p>{patient.emergency_contact_relationship}</p>
                          </div>
                        )}
                        {patient.emergency_contact_phone && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p>{patient.emergency_contact_phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(patient.allergies || patient.medical_conditions) && (
                    <div>
                      <h3 className="text-lg font-medium">Medical Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {patient.allergies && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                            <p className="whitespace-pre-line">{patient.allergies}</p>
                          </div>
                        )}
                        {patient.medical_conditions && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
                            <p className="whitespace-pre-line">{patient.medical_conditions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
