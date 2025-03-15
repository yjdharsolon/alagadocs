
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientDisplayCard } from '@/components/upload/PatientDisplayCard';
import { Patient } from '@/types/patient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserStructuredNotes } from '@/services/structuredTextService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Stethoscope, File, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);

  useEffect(() => {
    // Get patient from location state or session storage
    const patientFromState = location.state?.patient;
    const patientFromStorage = sessionStorage.getItem('selectedPatient');
    
    if (patientFromState) {
      setPatient(patientFromState);
      sessionStorage.setItem('selectedPatient', JSON.stringify(patientFromState));
    } else if (patientFromStorage) {
      setPatient(JSON.parse(patientFromStorage));
    } else {
      // No patient selected, redirect back to select patient
      toast.error('No patient selected');
      navigate('/select-patient');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Fetch patient's structured notes when patient is loaded
    async function fetchPatientNotes() {
      if (!patient?.id) return;
      
      try {
        setLoading(true);
        const notes = await getUserStructuredNotes();
        // Filter notes that belong to this patient
        const patientNotes = notes.filter(note => note.patient_id === patient.id);
        setPatientNotes(patientNotes);
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
    // Navigate to upload page to start consultation
    navigate('/upload');
  };

  const handleViewNote = (noteId: string) => {
    // Navigate to structured output page with the note ID
    navigate(`/structured-output?noteId=${noteId}`);
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
          <div className="w-[100px]"></div> {/* Spacer for flex alignment */}
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
                        // Get a preview of the content from the first section
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
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
