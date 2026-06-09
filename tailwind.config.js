/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F0F4F8',
        'sidebar': '#0F172A',
        'sidebar-hover': '#1E293B',
        'sidebar-active': '#1D4ED8',
        primary: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
          mid: '#BFDBFE',
          dark: '#1D4ED8',
        },
        // Semantic aliases for convenience
        success: '#16A34A',
        'success-light': '#F0FDF4',
        'success-mid': '#BBF7D0',
        warning: '#D97706',
        'warning-light': '#FFFBEB',
        'warning-mid': '#FDE68A',
        danger: '#DC2626',
        'danger-light': '#FEF2F2',
        'danger-mid': '#FECACA',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
        'border-light': '#E2E8F0',
        'border-medium': '#CBD5E1',
        'surface-raised': '#F8FAFC',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card:   '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        raised: '0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)',
        modal:  '0 20px 60px rgba(15,23,42,0.12)',
        blue:   '0 4px 14px rgba(37,99,235,0.18)',
      },
      maxWidth: {
        'content': '1280px',
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.15)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        waveform: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '28px' },
        },
      },
    },
  },
  plugins: [],
};
