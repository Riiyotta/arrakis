import plugin from 'tailwindcss/plugin.js'

/* ──────────────────────────────────────────────────────────────────────────
   Type scale.

   The original is Tailwind v4, where a `text-<role>` utility carries its own
   font-family, size, line-height, weight and letter-spacing. A v3 `fontSize`
   theme entry CANNOT set font-family, so porting these as fontSize entries
   silently rendered every heading in the body face. They are therefore emitted
   as complete utilities by the plugin at the bottom of this file.

   font-size is a fluid clamp interpolating between viewport 480px and 1280px.
   line-height is NOT fluid: it is a unitless ratio with a single step at
   768px (`md`). Six roles step; the rest hold one value at every width.
   Both sets of values are read verbatim out of the original's shipped CSS.
   letter-spacing is in `em`, so it tracks the fluid size automatically.
   ────────────────────────────────────────────────────────────────────────── */

const px = (n) => `${n}px`

/* Linear interpolation between a 480px-viewport value and a 1280px one. */
const fluid = (m, d) => {
  if (m === d) return px(m)
  const lo = px(Math.min(m, d))
  const hi = px(Math.max(m, d))
  return `clamp(${lo}, calc(${px(m)} + ${d - m} * (100vw - 480px) / 800), ${hi})`
}

const LEADING_TIGHT = 1.25
const LEADING_NORMAL = 1.5

// [ mobileSize, desktopSize, lineHeight, lineHeightMd|null, weight, letterSpacing, family ]
const ROLES = {
  'heading-80':  [48, 80, 1.1, 0.9, 300, '-0.03em', 'heading'],
  'heading-56':  [36, 56, 1.1, 0.98, 300, '-0.03em', 'heading'],
  'heading-48':  [28, 48, 1.1, 1.05, 300, '-0.03em', 'heading'],
  'heading-40':  [26, 40, 1.1, null, 300, '-0.03em', 'heading'],
  'heading-404': [32, 40, 1.1, null, 300, '-0.03em', 'heading'],
  'heading-32':  [24, 32, LEADING_TIGHT, 1.15, 300, '-0.03em', 'heading'],
  'heading-28':  [22, 28, 1.15, null, 300, '-0.03em', 'heading'],
  'heading-24':  [20, 24, 1.2, null, 300, '-0.03em', 'heading'],
  /* The shipped CSS declares these two at 1.1, but they RENDER at ratio 1 on
     the original and no stylesheet rule matches the element for line-height.
     Both roles are only ever applied to the `number-flow-react` custom
     element, whose shadow-root styles force `line-height: 1` on the host, so
     the declared 1.1 never takes effect. Measured on the live site: 56/56
     @1440, 45.76/45.76 @768, 40/40 @390. Matching the rendered value here is
     what reproduces the original; do not "restore" 1.1.
     (CLONE_SPEC §4.5's stats-section heights encode the 1.1 error.) */
  'stat-56':     [40, 56, 1, null, 300, '-0.03em', 'heading'],
  'stat-48':     [36, 48, 1, null, 300, '-0.03em', 'heading'],

  'body-22-light':   [18, 22, 1.3, null, 300, 'normal', 'body'],
  'body-20-regular': [17, 20, 1.3, null, 400, 'normal', 'body'],
  'body-20-light':   [17, 20, 1.3, null, 300, 'normal', 'body'],
  'body-18-regular': [16, 18, LEADING_NORMAL, null, 400, 'normal', 'body'],
  'body-18-light':   [16, 18, LEADING_NORMAL, null, 300, 'normal', 'body'],
  'body-16-regular': [15, 16, LEADING_NORMAL, null, 400, '0.01em', 'body'],
  'body-16-light':   [15, 16, LEADING_NORMAL, null, 300, '0.01em', 'body'],
  'body-15-regular': [15, 15, LEADING_NORMAL, null, 400, '0.01em', 'body'],
  'body-15-light':   [15, 15, LEADING_NORMAL, null, 300, '0.01em', 'body'],
  'body-15-banner':  [14, 15, LEADING_NORMAL, null, 300, '0.01em', 'body'],

  'nav-link':        [14, 15, 1.2, null, 400, 'normal', 'body'],
  /* measured on /platform: weight 500 and +0.01em. There is no 500 webfont,
     so this synthesises — which is what the original does too. */
  'btn-link':        [14, 15, 1.2, null, 500, '0.01em', 'body'],
  'mobile-nav-link': [18, 18, 1.2, null, 300, '-0.01em', 'body'],
  'submenu-heading': [16, 18, LEADING_NORMAL, 1.2, 400, 'normal', 'body'],

  /* The "Last updated" line on the legal pages is NOT a scale role: it
     inherits root 16px/1.5 with normal tracking and does not fluid-scale. */
  'legal-meta':      [16, 16, LEADING_NORMAL, null, 400, 'normal', 'body'],

  'mono-s':          [12, 12, 1.15, 1, 400, '0.05em', 'mono'],
  'mono-l':          [14, 15, 1, null, 400, '-0.02em', 'mono'],
}

const FAMILIES = {
  heading: ['terraneSerif', 'terraneSerif Fallback', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
  body: ['terraneSans', 'terraneSans Fallback', 'ui-sans-serif', 'system-ui', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
  mono: ['pxGrotesk', 'pxGrotesk Fallback', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
}

const quoteFamily = (list) =>
  list.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ')

const typeUtilities = Object.fromEntries(
  Object.entries(ROLES).map(([name, [ms, ds, lh, lhMd, weight, ls, family]]) => [
    `.text-${name}`,
    {
      fontFamily: quoteFamily(FAMILIES[family]),
      fontSize: fluid(ms, ds),
      lineHeight: String(lh),
      fontWeight: String(weight),
      letterSpacing: ls,
      ...(lhMd !== null ? { '@media (min-width: 768px)': { lineHeight: String(lhMd) } } : {}),
    },
  ]),
)

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0F0C0B',
        white: '#FFFFFF',
        day: '#FFFFFF',
        night: '#1B1613',
        sun: '#FF8B3E',
        dawn: '#7993E2',
        dust: '#FBF6EC',
        sand: '#FBEFD6',
        dusk: '#3F3630',
        midnight: '#27221F',
        desert: '#FFDBAD',
        bone: '#FFF6E5',
        twilight: '#15203D',
        'stroke-1': '#DFD8D3',
        'stroke-2': '#B1ACA6',
        'stroke-3': '#54504E',
        /* ad-hoc hexes used inline in the original markup */
        ink: '#0B0907',   // hero section background
        panel: '#FDFAF6', // integrations panel card
        matrix: '#191614',// stats-grid decorative bar matrix
      },
      fontFamily: FAMILIES,
      spacing: {
        4.5: '1.125rem', 9.5: '2.375rem', 15: '3.75rem', 17: '4.25rem',
        18: '4.5rem', 30: '7.5rem', 42: '10.5rem', 50: '12.5rem',
        53: '13.25rem', 72.5: '18.125rem', 92: '23rem', 100: '25rem', 102: '25.5rem',
        177.5: '44.375rem', 194: '48.5rem',
      },
      maxWidth: { 177.5: '44.375rem' },
      borderRadius: { xs: '2px', sm: '4px', md: '6px', lg: '8px' },
      transitionDuration: { DEFAULT: '250ms', 350: '350ms', 1300: '1300ms' },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(.4,0,.2,1)',
        'ease-out': 'cubic-bezier(0,0,.2,1)',
        'ease-in-out': 'cubic-bezier(.4,0,.2,1)',
      },
      boxShadow: { lg: '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)' },
      screens: {
        'min-346': '346px', 'min-960': '960px', 'min-1218': '1218px',
        'min-1328': '1328px', 'min-1346': '1346px', 'min-1440': '1440px',
        'min-1446': '1446px',
      },
      zIndex: { 1: '1', 2: '2' },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(typeUtilities)
    }),
  ],
}
