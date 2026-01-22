import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury theme colors from existing design
        primary: '#1a1a1a',
        secondary: '#c9a86c',
        accent: '#d4af37',
        gold: {
          DEFAULT: '#d4af37',
          light: '#e5c76b',
          dark: '#c9a86c',
        },
        cream: '#f8f6f3',
        text: {
          DEFAULT: '#333333',
          light: '#666666',
          muted: '#999999',
        },
        border: '#e8e8e8',
        success: '#4caf50',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.2' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'lg': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      maxWidth: {
        'container': '1400px',
      },
      spacing: {
        'container': '40px',
      },
    },
  },
  plugins: [],
}

export default config
