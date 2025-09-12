import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nin: string;
  level: string;
  avatar?: string;
  totalEarnings: number;
  availableBalance: number;
  pendingWithdrawals: number;
  chainProgress: number;
  membersReferred: number;
  totalRequired: number;
  isActivated: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    phone: string;
    email: string;
    nin: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data for demonstration
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+2348123456789',
    nin: '12345678901',
    level: 'Growth',
    avatar: undefined,
    totalEarnings: 45000,
    availableBalance: 15000,
    pendingWithdrawals: 8000,
    chainProgress: 75,
    membersReferred: 15,
    totalRequired: 20,
    isActivated: true,
  };

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (phone: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockUser);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    phone: string;
    email: string;
    nin: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate signup API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser: User = {
        ...mockUser,
        ...userData,
        id: Date.now().toString(),
        totalEarnings: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        chainProgress: 0,
        membersReferred: 0,
        totalRequired: 20,
        isActivated: false,
      };
      setUser(newUser);
    } catch (error) {
      Alert.alert('Signup Failed', 'Unable to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};