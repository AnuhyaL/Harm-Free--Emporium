/** Semantic tokens only. Raw brand hex values live in src/styles/tokens.css. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    fontSize: {
      xs: ['12px', { lineHeight: '1.5' }],
      sm: ['14px', { lineHeight: '1.55' }],
      base: ['16px', { lineHeight: '1.6' }],
      lg: ['20px', { lineHeight: '1.5' }],
      xl: ['24px', { lineHeight: '1.35' }],
      '2xl': ['32px', { lineHeight: '1.2' }],
      '3xl': ['44px', { lineHeight: '1.1' }],
      '4xl': ['64px', { lineHeight: '1.02' }],
    },
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        tint: token('tint'),
        card: token('card'),
        fg: token('fg'),
        muted: token('muted'),
        line: token('line'),
        link: token('link'),
        primary: token('primary'),
        'primary-fg': token('primary-fg'),
        gold: token('gold'),
        'gold-fg': token('gold-fg'),
        success: token('success'),
        danger: token('danger'),
        emerald: token('emerald'),
        navy: token('navy'),
        paper: token('paper'),
        sky: token('sky'),
        sage: token('sage'),
        mist: token('mist'),
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { content: '1280px' },
      borderRadius: { card: '16px', soft: '12px' },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--shadow) / 0.06), 0 4px 16px rgb(var(--shadow) / 0.06)',
        lift: '0 2px 4px rgb(var(--shadow) / 0.08), 0 12px 32px rgb(var(--shadow) / 0.12)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
};
