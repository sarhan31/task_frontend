/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand / Primary ───────────────────────────────────────────────
        brand: {
          DEFAULT: '#13856f',   // primary teal-green  (used 284×)
          dark:    '#0f7260',   // hover state          (used 34×)
          darker:  '#0f6c57',   // deep press state     (used 45×)
          deepest: '#0c5d4b',   // darkest shade        (used 13×)
          light:   '#e8f6f2',   // tint background      (used 54×)
          muted:   '#b8e0d8',   // soft tint            (used 10×)
          alt:     '#1b9b82',   // gradient variant     (used 4×)
        },
        // ── Warm / Secondary ─────────────────────────────────────────────
        warm: {
          DEFAULT: '#8d514f',   // terracotta-brown     (used 42×)
          dark:    '#723f3d',   // dark terracotta      (used 1×)
          accent:  '#b5722a',   // amber-orange         (used 18×)
          light:   '#efbf91',   // peach highlight      (used 25×)
          soft:    '#f3b59e',   // soft peach           (used 8×)
          pale:    '#f0d9be',   // pale peach           (used 7×)
        },
        // ── Background surfaces ──────────────────────────────────────────
        surface: {
          page:    '#f7e3cf',   // main page background (used 6×)
          base:    '#fff8f3',   // top-bar / nav bg     (used 5×)
          card:    '#fffaf6',   // card background      (used 57×)
          hover:   '#fff8ef',   // card hover           (used 13×)
          muted:   '#fff4ef',   // muted surface        (used 6×)
        },
        // ── Border / Divider ────────────────────────────────────────────
        border: {
          DEFAULT: '#ead8cb',   // primary border       (used 70×)
          light:   '#f4ddd0',   // light border         (used 62×)
          soft:    '#e6d6ca',   // softest border       (used 18×)
          muted:   '#eadfd4',   // muted border         (used 4×)
        },
        // ── Status colours ───────────────────────────────────────────────
        status: {
          error:      '#fdf0ef',   // error bg tint     (used 14×)
          warning:    '#fff8ef',   // warning bg tint   (same as surface.hover)
          errorAccent:'#c26a44',   // error accent      (used 9×)
          errorBg:    '#f4c5c1',   // error pill bg     (used 9×)
        },
        // ── Existing design-system tokens (kept for AdvancedButton etc.) ─
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'glow':    '0 0 20px rgba(99,102,241,0.3)',
        'glow-lg': '0 0 30px rgba(99,102,241,0.4)',
        'glass':   '0 8px 32px 0 rgba(31,38,135,0.37)',
        // Brand-tinted shadows
        'brand':   '0 4px 14px rgba(19,133,111,0.25)',
        'brand-lg':'0 8px 24px rgba(19,133,111,0.28)',
        'brand-xl':'0 12px 32px rgba(19,133,111,0.36)',
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary':   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-accent':    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-brand':     'linear-gradient(135deg, #13856f 0%, #1b9b82 100%)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'gradient':    'gradient 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(99,102,241,0.6)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
