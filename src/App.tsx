
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
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
