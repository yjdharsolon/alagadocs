
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/ask-ai" element={<AskAIPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
