
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'sonner';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import ProfilePage from './pages/profile';
import RoleSelectionPage from './pages/role-selection';
import SelectPatientPage from './pages/select-patient';
import PatientDetailsPage from './pages/patient-details';
import RegisterPatientPage from './pages/register-patient';
import EditPatientPage from './pages/edit-patient';
import UploadPage from './pages/upload';
import TranscriptionPage from './pages/transcribe';
import EditTranscriptPage from './pages/edit-transcript';
import StructuredOutputPage from './pages/structured-output';
import AskAIPage from './pages/ask-ai';
import TemplatesPage from './pages/templates';
import CopyToEMRPage from './pages/copy-to-emr';
import CustomizeTemplatePage from './pages/customize-template';
import RatingsPage from './pages/ratings';
import BillingPage from './pages/billing';
import UnifiedTranscriptionPage from './pages/unified-transcription';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const queryClient = new QueryClient();
  
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/role-selection" element={<ProtectedRoute><RoleSelectionPage /></ProtectedRoute>} />
            <Route path="/select-patient" element={<ProtectedRoute><SelectPatientPage /></ProtectedRoute>} />
            <Route path="/patient-details" element={<ProtectedRoute><PatientDetailsPage /></ProtectedRoute>} />
            <Route path="/register-patient" element={<ProtectedRoute><RegisterPatientPage /></ProtectedRoute>} />
            <Route path="/edit-patient" element={<ProtectedRoute><EditPatientPage /></ProtectedRoute>} />
            
            {/* Original separate pages */}
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/transcribe" element={<ProtectedRoute><TranscriptionPage /></ProtectedRoute>} />
            <Route path="/edit-transcript" element={<ProtectedRoute><EditTranscriptPage /></ProtectedRoute>} />
            <Route path="/structured-output" element={<ProtectedRoute><StructuredOutputPage /></ProtectedRoute>} />
            
            {/* New unified transcription page */}
            <Route path="/unified-transcription" element={<ProtectedRoute><UnifiedTranscriptionPage /></ProtectedRoute>} />
            
            <Route path="/ask-ai" element={<ProtectedRoute><AskAIPage /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
            
            {/* Phase 3 completion routes */}
            <Route path="/copy-to-emr" element={<ProtectedRoute><CopyToEMRPage /></ProtectedRoute>} />
            <Route path="/customize-template" element={<ProtectedRoute><CustomizeTemplatePage /></ProtectedRoute>} />
            <Route path="/ratings" element={<ProtectedRoute><RatingsPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
