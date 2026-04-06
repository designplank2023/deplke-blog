import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#1F2937',
          secondary: '#6366F1',
          accent: '#F59E0B',
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            a: {
              color: '#6366F1',
              '&:hover': {
                color: '#4F46E5',
              },
            },
            code: {
              color: '#DC2626',
              backgroundColor: '#FEF2F2',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
            },
            pre: {
              backgroundColor: '#1F2937',
              color: '#F3F4F6',
            },
            'pre code': {
              color: '#F3F4F6',
              backgroundColor: 'transparent',
              padding: '0',
              fontWeight: 'normal',
            },
            h1: {
              color: '#111827',
              fontWeight: '700',
            },
            h2: {
              color: '#1F2937',
              fontWeight: '600',
            },
            h3: {
              color: '#374151',
              fontWeight: '600',
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
            blockquote: {
              color: '#6B7280',
              borderLeftColor: '#6366F1',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
