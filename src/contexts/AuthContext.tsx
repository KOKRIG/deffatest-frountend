import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  const [profileFetchAttempts, setProfileFetchAttempts] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (session) {
          console.log('Initial session found:', session.user.id);
          await handleSession(session);
        } else {
          console.log('No initial session found');
          setUser(null);
          setProfile(null);
          setSession(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during initial auth check:', error);
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setInitialAuthCheckComplete(true);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session) {
        await handleSession(session);
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
        setLoading(false);
        setProfileFetchAttempts(0);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Retry profile fetch with exponential backoff
  useEffect(() => {
    if (!user || profile || !initialAuthCheckComplete || profileFetchAttempts >= 3) {
      return;
    }

    const retryDelay = Math.min(1000 * Math.pow(2, profileFetchAttempts), 5000);
    console.log(`Retrying profile fetch in ${retryDelay}ms (attempt ${profileFetchAttempts + 1})`);
    
    const timer = setTimeout(() => {
      fetchProfile(user.id);
    }, retryDelay);

    return () => clearTimeout(timer);
  }, [user, profile, initialAuthCheckComplete, profileFetchAttempts]);

  const handleSession = async (session: Session) => {
    setSession(session);
    setUser(session.user);
    setProfileFetchAttempts(0); // Reset attempts for new session
    
    if (session.user) {
      await fetchProfile(session.user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      setProfileFetchAttempts(prev => prev + 1);
      
      // Set a timeout for the profile fetch
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId) // Use user_id instead of id
        .maybeSingle();

      const { data: existingProfile, error: fetchError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        console.log('Profile found:', existingProfile);
        setProfile(existingProfile);
        setLoading(false);
        setProfileFetchAttempts(0);
        return;
      }

      // Profile doesn't exist, create it
      console.log('No profile found, creating one');
      await createProfileManually(userId);
      
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      
      if (profileFetchAttempts >= 3) {
        console.error('Max profile fetch attempts reached, continuing without profile');
        // Create a minimal profile to prevent infinite loading
        const fallbackProfile: Profile = {
          user_id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || '',
          company_name: '', // Using company_name instead of company
          industry: 'Other',
          plan_type: 'free', // Using plan_type instead of subscription_plan
          subscription_status: 'FREE',
          tests_this_month_count: 0,
          concurrent_test_slots: 1,
          created_at: new Date().toISOString()
        };
        setProfile(fallbackProfile);
        setLoading(false);
      }
    }
  };

  const createProfileManually = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      
      if (!currentUser) {
        console.error('No user data available for profile creation');
        setLoading(false);
        return;
      }

      console.log('Creating profile manually for user:', userId);

      const profileData = {
        user_id: userId, // Using user_id instead of id
        email: currentUser.email || '',
        full_name: currentUser.user_metadata?.full_name || '',
        plan_type: 'free', // Using plan_type instead of subscription_plan
        subscription_status: 'FREE',
        concurrent_test_slots: 1,
        tests_this_month_count: 0,
        max_test_duration_minutes: 5, // Added to match new schema
        industry: 'Other',
        company_name: '' // Using company_name instead of company
      };

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile manually:', error);
        
        // Try to fetch again in case profile was created by trigger
        const { data: retryProfile, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId) // Using user_id instead of id
          .maybeSingle();
          
        if (retryError) {
          console.error('Error fetching profile after creation attempt:', retryError);
          throw retryError;
        }
        
        if (retryProfile) {
          console.log('Profile found on retry:', retryProfile);
          setProfile(retryProfile);
          setLoading(false);
          setProfileFetchAttempts(0);
          return;
        }
        
        throw error;
      }

      console.log('Profile created manually:', newProfile);
      setProfile(newProfile);
      setLoading(false);
      setProfileFetchAttempts(0);
      
    } catch (error) {
      console.error('Error in createProfileManually:', error);
      
      // If we can't create a profile after multiple attempts, set loading to false
      if (profileFetchAttempts >= 3) {
        setLoading(false);
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Signing up user:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        setLoading(false);
        throw error;
      }

      console.log('Signup successful:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      setLoading(true);
      setProfileFetchAttempts(0); // Reset attempts
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        setLoading(false);
        throw error;
      }

      console.log('Signin successful:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      setProfileFetchAttempts(0);
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id); // Using user_id instead of id

      if (error) throw error;
      
      // Refresh profile
      await fetchProfile(user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading: loading && !initialAuthCheckComplete,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}