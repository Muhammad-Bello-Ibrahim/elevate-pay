import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { tokens } from './src/theme/tokens';

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./src-web/**/*.{ts,tsx}",
		"./index.html"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// ElevateX Brand Colors
				brand: {
					dark: `hsl(${tokens.colors.brand.dark})`,
					darker: `hsl(${tokens.colors.brand.darker})`,
					navy: `hsl(${tokens.colors.brand.navy})`,
					slate: `hsl(${tokens.colors.brand.slate})`,
				},
				neon: {
					cyan: `hsl(${tokens.colors.neon.cyan})`,
					purple: `hsl(${tokens.colors.neon.purple})`,
					green: `hsl(${tokens.colors.neon.green})`,
					pink: `hsl(${tokens.colors.neon.pink})`,
					orange: `hsl(${tokens.colors.neon.orange})`,
				},
				glass: tokens.colors.glass,
			},
			backgroundImage: {
				'gradient-primary': tokens.gradients.primary,
				'gradient-secondary': tokens.gradients.secondary,
				'gradient-success': tokens.gradients.success,
				'gradient-card': tokens.gradients.card,
				'gradient-glass': tokens.gradients.glass,
			},
			boxShadow: {
				'glow-cyan': tokens.shadows.glow.cyan,
				'glow-purple': tokens.shadows.glow.purple,
				'glow-green': tokens.shadows.glow.green,
				'card': tokens.shadows.card,
				'elevated': tokens.shadows.elevated,
				'glass': tokens.shadows.glass,
			},
			backdropBlur: {
				'glass': tokens.blur.glass,
				'strong': tokens.blur.strong,
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				...tokens.borderRadius,
			},
			fontFamily: tokens.typography.fontFamily,
			fontSize: tokens.typography.fontSize,
			fontWeight: tokens.typography.fontWeight,
			spacing: tokens.spacing,
			transitionDuration: tokens.animation.duration,
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				...tokens.animation.easing,
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'progress-fill': {
					'0%': { width: '0%' },
					'100%': { width: 'var(--progress-width)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: tokens.shadows.glow.cyan },
					'50%': { boxShadow: `0 0 30px hsl(${tokens.colors.neon.cyan} / 0.5)` }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.5s ease-out',
				'progress-fill': 'progress-fill 1s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
