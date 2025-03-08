
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import RoleSelection from '@/pages/role-selection';
import Upload from '@/pages/upload';
import Transcribe from '@/pages/transcribe';
import StructuredOutput from '@/pages/structured-output';
import EditTranscript from '@/pages/edit-transcript';
import PasswordReset from '@/pages/password-reset';
import UpdatePassword from '@/pages/update-password';
import Profile from '@/pages/profile';
import AskAI from '@/pages/ask-ai';
import Documentation from '@/pages/documentation';
import AuthCallback from '@/pages/auth/callback';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/documentation" element={<Documentation />} />
          
          {/* Protected Routes */}
          <Route
            path="/role-selection"
            element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/transcribe"
            element={
              <ProtectedRoute>
                <Transcribe />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/structured-output"
            element={
              <ProtectedRoute>
                <StructuredOutput />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/edit-transcript"
            element={
              <ProtectedRoute>
                <EditTranscript />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ask-ai"
            element={
              <ProtectedRoute>
                <AskAI />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
