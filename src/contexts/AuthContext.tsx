'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // If user logs in, we sync their profile to the backend customer record safely
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              uid: currentUser.uid,
              name: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            })
          });
        } catch (error) {
          console.error("Failed to sync user profile", error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we prompt for select_account if needed
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Login cancelled');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('Failed to log in. Please try again.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to log out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
