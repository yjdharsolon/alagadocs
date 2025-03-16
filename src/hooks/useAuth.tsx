
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, userData?: Record<string, string>) => Promise<void>;
  signOut: () => Promise<void>;
  getUserRole: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('Error in session initialization:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: !rememberMe ? {
          // @ts-ignore - The Supabase types are incorrect, expiresIn is a valid option
          expiresIn: 60 * 60 // 1 hour expiry when "remember me" is false
        } : undefined
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully signed in');
      navigate('/role-selection');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, string>) => {
    try {
      setLoading(true);
      // For now, we'll disable email verification to simplify the process
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Auto-sign in the user after signup for better UX
      if (data.user) {
        setUser(data.user);
        
        // Add user profile data to the profiles table if provided
        if (userData && data.user.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              first_name: userData.first_name,
              middle_name: userData.middle_name,
              last_name: userData.last_name,
              name_extension: userData.name_extension
            })
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }
      }
      
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      navigate('/login');
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the user's current role
  const getUserRole = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      getUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
