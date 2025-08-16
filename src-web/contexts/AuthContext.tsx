import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Simulate checking for stored auth token
    const checkAuth = async () => {
      try {
        // In a real app, you'd check localStorage/SecureStore for auth token
        const storedUser = localStorage.getItem('elevatex_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: '1',
        name: 'John Adebayo',
        email: 'john@example.com',
        phone: phone,
        nin: '12345678901',
        level: 'Growth',
        avatar: '',
        totalEarnings: 45000,
        availableBalance: 12500,
        pendingWithdrawals: 8000,
        chainProgress: 67.7,
        membersReferred: 21,
        totalRequired: 31,
        isActivated: true
      };
      
      setUser(mockUser);
      localStorage.setItem('elevatex_user', JSON.stringify(mockUser));
      localStorage.setItem('elevatex_token', 'mock_jwt_token');
      
    } catch (error) {
      throw new Error('Login failed');
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
  }) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data for new signup
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        nin: userData.nin,
        level: 'Starter',
        avatar: '',
        totalEarnings: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        chainProgress: 0,
        membersReferred: 0,
        totalRequired: 31,
        isActivated: false
      };
      
      setUser(newUser);
      localStorage.setItem('elevatex_user', JSON.stringify(newUser));
      localStorage.setItem('elevatex_token', 'mock_jwt_token');
      
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elevatex_user');
    localStorage.removeItem('elevatex_token');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('elevatex_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};