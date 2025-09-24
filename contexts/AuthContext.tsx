"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/lib/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  registerUserProfile: (data: UserProfileData) => Promise<void>;
}

interface UserProfileData {
  name: string;
  phone: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);


      toast({
        title: "Success",
        description: "Signed in successfully!",
      });
    } catch (error: any) {
      let message = "Failed to sign in";

      if (error.code === 'auth/user-not-found') {
        message = "No account found with this email";
      } else if (error.code === 'auth/wrong-password') {
        message = "Incorrect password";
      } else if (error.code === 'auth/invalid-email') {
        message = "Invalid email address";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send email verification (optional)
      await sendEmailVerification(userCredential.user);

      toast({
        title: "Success",
        description: "Account created successfully! You can now use the application.",
      });

      return userCredential;
    } catch (error: any) {
      let message = "Failed to create account";

      if (error.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters";
      } else if (error.code === 'auth/invalid-email') {
        message = "Invalid email address";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      });

      return result;
    } catch (error: any) {
      let message = "Failed to sign in with Google";

      if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in popup was closed";
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = "Sign-in request was cancelled";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Signed out successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      await sendEmailVerification(user);
      toast({
        title: "Success",
        description: "Verification email sent!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const registerUserProfile = async (data: UserProfileData) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const token = await user.getIdToken();

      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register profile');
      }

      toast({
        title: "Success",
        description: "Profile registered successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    sendVerificationEmail,
    registerUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};