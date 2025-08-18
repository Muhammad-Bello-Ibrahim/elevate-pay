// ElevateX Design System - Crypto-inspired Tokens
// Dark theme with neon accents and glassmorphism

export const tokens = {
  colors: {
    // Core brand colors (HSL format for CSS compatibility)
    brand: {
      dark: '222 28% 8%',    // Deep space navy #141625
      darker: '220 30% 5%',  // Almost black #0A0D14
      navy: '218 28% 12%',   // Dark navy #1A1F2E
      slate: '216 20% 20%',  // Dark slate #2A3441
    },
    
    // Neon accent colors
    neon: {
      cyan: '180 100% 50%',    // Electric cyan #00FFFF
      purple: '271 91% 65%',   // Neon purple #8B5CF6
      green: '160 84% 39%',    // Neon green #10B981
      pink: '316 73% 52%',     // Hot pink #E879F9
      orange: '25 95% 53%',    // Neon orange #FB923C
    },
    
    // Glassmorphism backgrounds
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      dark: 'rgba(0, 0, 0, 0.2)',
      darker: 'rgba(0, 0, 0, 0.4)',
    },
    
    // Semantic colors
    success: '160 84% 39%',  // Green
    warning: '25 95% 53%',   // Orange
    error: '0 84% 60%',      // Red
    info: '180 100% 50%',    // Cyan
    
    // Text colors
    text: {
      primary: '210 40% 98%',     // Nearly white
      secondary: '210 40% 78%',   // Light gray
      muted: '215 16% 47%',       // Medium gray
      inverse: '222 28% 8%',      // Dark (for light backgrounds)
    },
    
    // Background colors
    background: {
      primary: '222 28% 8%',      // Main dark bg
      secondary: '218 28% 12%',   // Slightly lighter
      card: '216 20% 20%',        // Card background
      elevated: '215 25% 27%',    // Elevated surfaces
    },
    
    // Border colors
    border: {
      default: 'rgba(255, 255, 255, 0.1)',
      focus: '180 100% 50%',      // Cyan for focus states
      muted: 'rgba(255, 255, 255, 0.05)',
    }
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, hsl(180 100% 50%), hsl(271 91% 65%))',
    secondary: 'linear-gradient(135deg, hsl(271 91% 65%), hsl(316 73% 52%))',
    success: 'linear-gradient(135deg, hsl(160 84% 39%), hsl(180 100% 50%))',
    card: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    glass: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
  },
  
  shadows: {
    glow: {
      cyan: '0 0 20px hsl(180 100% 50% / 0.3)',
      purple: '0 0 20px hsl(271 91% 65% / 0.3)',
      green: '0 0 20px hsl(160 84% 39% / 0.3)',
    },
    card: '0 8px 32px rgba(0, 0, 0, 0.3)',
    elevated: '0 12px 40px rgba(0, 0, 0, 0.4)',
    glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  },
  
  blur: {
    glass: '10px',
    strong: '20px',
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }
  }
};

export default tokens;