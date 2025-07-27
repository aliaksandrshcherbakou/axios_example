import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import React, {ReactNode, createContext, useContext, useEffect, useState} from 'react';
import {auth} from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInAnonymous: () => Promise<void>;
  logout: () => Promise<void>;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log('Auth state changed:', user ? `User: ${user.uid} (${user.email || 'anonymous'})` : 'No user');
      setUser(user);
      setLoading(false);

      if (!user) {
        console.log('User is now null - should navigate to auth screens');
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signInAnonymous = async (): Promise<void> => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Attempting to sign out user...');
      await signOut(auth);
      console.log('Successfully signed out user');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(`Failed to log out: ${error.message || 'Unknown error'}`);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInAnonymous,
    logout,
    isAnonymous: user?.isAnonymous || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
