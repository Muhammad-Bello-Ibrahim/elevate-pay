import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@elevatex_theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on app start
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else {
        // If no saved theme, use system preference with dark as fallback
        setThemeState(systemColorScheme === 'light' ? 'light' : 'dark');
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
      setThemeState(defaultTheme);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark: theme === 'dark',
    toggleTheme,
  };

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook for themed styles
export function useThemedStyles() {
  const { isDark } = useTheme();
  
  return {
    // Background colors
    background: isDark ? 'bg-brand-dark' : 'bg-white',
    backgroundSecondary: isDark ? 'bg-brand-navy' : 'bg-gray-50',
    backgroundCard: isDark ? 'bg-brand-slate' : 'bg-white',
    
    // Text colors
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Border colors
    border: isDark ? 'border-white/10' : 'border-gray-200',
    borderFocus: 'border-neon-cyan',
    
    // Shadow styles for cards
    cardShadow: isDark ? 'shadow-glass' : 'shadow-lg',
    
    // Glass morphism
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    
    // Interactive states
    hover: isDark ? 'active:bg-white/10' : 'active:bg-gray-100',
    pressed: isDark ? 'bg-white/20' : 'bg-gray-200',
  };
}