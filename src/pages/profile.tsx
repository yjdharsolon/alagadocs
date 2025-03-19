
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/services/userService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, Stethoscope, Building2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameExtension, setNameExtension] = useState('');
  const [medicalTitle, setMedicalTitle] = useState('');
  const [profession, setProfession] = useState('');
  
  // Professional Credentials
  const [prcLicense, setPrcLicense] = useState('');
  const [ptrNumber, setPtrNumber] = useState('');
  const [s2Number, setS2Number] = useState('');
  
  // Clinic Information
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicSchedule, setClinicSchedule] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
        }

        if (roleData) {
          setUserRole(roleData.role);
        }

        // Fetch user profile
        const profileData = await getUserProfile(user.id);
        
        if (profileData) {
          setFirstName(profileData.first_name || '');
          setMiddleName(profileData.middle_name || '');
          setLastName(profileData.last_name || '');
          setNameExtension(profileData.name_extension || '');
          setMedicalTitle(profileData.medical_title || '');
          setProfession(profileData.profession || '');
          setPrcLicense(profileData.prc_license || '');
          setPtrNumber(profileData.ptr_number || '');
          setS2Number(profileData.s2_number || '');
          setClinicName(profileData.clinic_name || '');
          setClinicAddress(profileData.clinic_address || '');
          setClinicSchedule(profileData.clinic_schedule || '');
          setContactNumber(profileData.contact_number || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      await updateUserProfile(user.id, {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        name_extension: nameExtension,
        medical_title: medicalTitle,
        profession,
        prc_license: prcLicense,
        ptr_number: ptrNumber,
        s2_number: s2Number,
        clinic_name: clinicName,
        clinic_address: clinicAddress,
        clinic_schedule: clinicSchedule,
        contact_number: contactNumber,
        updated_at: new Date().toISOString(),
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">
                      {userRole || (
                        <Link to="/role-selection" className="text-primary hover:underline">
                          Select a role
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/role-selection">
                  <Button variant="outline" className="w-full">Change Role</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">
                  <UserRound className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="professional">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Professional Info
                </TabsTrigger>
                <TabsTrigger value="clinic">
                  <Building2 className="h-4 w-4 mr-2" />
                  Clinic Details
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="middleName">Middle Name</Label>
                          <Input
                            id="middleName"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nameExtension">Name Extension</Label>
                          <Input
                            id="nameExtension"
                            value={nameExtension}
                            onChange={(e) => setNameExtension(e.target.value)}
                            placeholder="Jr., Sr., etc."
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="medicalTitle">Medical Title</Label>
                          <Input
                            id="medicalTitle"
                            value={medicalTitle}
                            onChange={(e) => setMedicalTitle(e.target.value)}
                            placeholder="MD, DMD, FPCP, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profession">Profession/Specialty</Label>
                          <Input
                            id="profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            placeholder="e.g. Cardiologist, Pediatric Nurse, etc."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Saving...' : 'Save Personal Info'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Credentials</CardTitle>
                    <CardDescription>
                      Update your professional licensure information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="prcLicense">PRC License Number</Label>
                        <Input
                          id="prcLicense"
                          value={prcLicense}
                          onChange={(e) => setPrcLicense(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ptrNumber">PTR Number (if applicable)</Label>
                          <Input
                            id="ptrNumber"
                            value={ptrNumber}
                            onChange={(e) => setPtrNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="s2Number">S2 Number (if applicable)</Label>
                          <Input
                            id="s2Number"
                            value={s2Number}
                            onChange={(e) => setS2Number(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Saving...' : 'Save Professional Info'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="clinic">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinic Information</CardTitle>
                    <CardDescription>
                      Update details about your practice location
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicName">Name of the Clinic</Label>
                        <Input
                          id="clinicName"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinicAddress">Address of the Clinic</Label>
                        <Textarea
                          id="clinicAddress"
                          value={clinicAddress}
                          onChange={(e) => setClinicAddress(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinicSchedule">Operating Hours/Schedule</Label>
                        <Textarea
                          id="clinicSchedule"
                          value={clinicSchedule}
                          onChange={(e) => setClinicSchedule(e.target.value)}
                          placeholder="e.g. Monday-Friday: 9AM-5PM, Saturday: 9AM-12PM"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Saving...' : 'Save Clinic Info'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
