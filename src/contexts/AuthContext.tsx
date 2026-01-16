import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getUserByEmail, 
  createUser, 
  updateUser,
  initializeDemoData,
  getUsers,
  saveUsers
} from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();
    
    // Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Refresh user data from storage in case it was updated
      const freshUser = getUsers().find(u => u.id === currentUser.id);
      if (freshUser) {
        setUser(freshUser);
        setCurrentUser(freshUser);
      }
    }
    setIsLoading(false);
  }, []);

  const refreshUser = () => {
    if (user) {
      const freshUser = getUsers().find(u => u.id === user.id);
      if (freshUser) {
        setUser(freshUser);
        setCurrentUser(freshUser);
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      setUser(existingUser);
      setCurrentUser(existingUser);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${existingUser.name}`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "No account found with that email. Please sign up first.",
      variant: "destructive",
    });
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      toast({
        title: "Signup failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      return false;
    }
    
    const newUser = createUser({
      email,
      name,
      bio: '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    });
    
    setUser(newUser);
    setCurrentUser(newUser);
    toast({
      title: "Welcome to SkillSwap!",
      description: "Your account has been created successfully.",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
      setUser(users[index]);
      setCurrentUser(users[index]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
