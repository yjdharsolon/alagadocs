
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import AskAIPage from './pages/ask-ai';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile';
import RoleSelection from './pages/role-selection';
import AudioUploadPage from './pages/upload';
import TranscribePage from './pages/transcribe';
import StructuredOutputPage from './pages/structured-output';
import EditTranscriptPage from './pages/edit-transcript';
import AuthCallback from './pages/auth/callback';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { initializeApp } from './services/setupService';

function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/role-selection" element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        } />
        <Route path="/ask-ai" element={
          <ProtectedRoute>
            <AskAIPage />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <AudioUploadPage />
          </ProtectedRoute>
        } />
        <Route path="/transcribe" element={
          <ProtectedRoute>
            <TranscribePage />
          </ProtectedRoute>
        } />
        <Route path="/structured-output" element={
          <ProtectedRoute>
            <StructuredOutputPage />
          </ProtectedRoute>
        } />
        <Route path="/edit-transcript" element={
          <ProtectedRoute>
            <EditTranscriptPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
