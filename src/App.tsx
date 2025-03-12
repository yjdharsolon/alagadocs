
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import UploadPage from './pages/upload';
import TranscriptionPage from './pages/transcribe';
import EditTranscriptPage from './pages/edit-transcript';
import AskAIPage from './pages/ask-ai';
import TemplatesPage from './pages/templates';
import CopyToEMRPage from './pages/copy-to-emr';
import CustomizeTemplatePage from './pages/customize-template';
import RatingsPage from './pages/ratings';
import BillingPage from './pages/billing';
import UnifiedTranscriptionPage from './pages/unified-transcription';

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            
            {/* Original separate pages */}
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/transcribe" element={<TranscriptionPage />} />
            <Route path="/edit-transcript" element={<EditTranscriptPage />} />
            
            {/* New unified transcription page */}
            <Route path="/unified-transcription" element={<UnifiedTranscriptionPage />} />
            
            <Route path="/ask-ai" element={<AskAIPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            
            {/* Phase 3 completion routes */}
            <Route path="/copy-to-emr" element={<CopyToEMRPage />} />
            <Route path="/customize-template" element={<CustomizeTemplatePage />} />
            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
