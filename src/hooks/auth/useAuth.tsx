
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext, AuthProvider } from './AuthContext';
import { 
  signInWithPassword, 
  signUpNewUser, 
  signOutUser, 
  getUserRoleFromDb 
} from './authOperations';

// Re-export the AuthProvider
export { AuthProvider };

// Main hook that combines context with auth operations
export function useAuth() {
  const context = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Override the placeholder functions with implementations
  const authWithOperations = {
    ...context,
    loading: context.loading || loading,
    
    signIn: async (email: string, password: string, rememberMe = false) => {
      await signInWithPassword(email, password, rememberMe, navigate, setLoading);
    },
    
    signUp: async (email: string, password: string, userData?: Record<string, string>) => {
      await signUpNewUser(email, password, setLoading, (user) => {
        // This is a callback to update the user state if needed
      }, userData);
    },
    
    signOut: async () => {
      await signOutUser(navigate, setLoading);
    },
    
    getUserRole: async () => {
      return context.user ? await getUserRoleFromDb(context.user.id) : null;
    }
  };
  
  return authWithOperations;
}
