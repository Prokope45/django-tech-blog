/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple Window Buttons
        'apple-close': '#ff5f56',
        'apple-minimize': '#ffbd2e',
        'apple-expand': '#27c93f',

        // Blue
        'columbia-blue': '#CEE5f2',
        'beau-blue': '#ACCBE1',
        'cerulean-frost': '#7C98B3',
        'dark-electric-blue': '#637081',
        'blue-sapphire': '#166088',
        'celadon-blue': '#2C7DA0',
        'blue-yonder': '#4A6FA5',
        'indigo-dye': '#01497C',
        'prussian-blue': '#2C3D55',
        'blue-green': '#468FAF',
        'dark-sky-blue': '#89C2D9',
        'light-blue': '#A9D6E5',
        'delft-blue': '#3F376C',
        'midnight-blue': '#2E2462',

        // Blue-gray
        'dark-blue-gray': '#66668F',
        'black-coral': '#536271',
        'charcoal': '#3E4C5E',
        'gunmetal': '#202831',

        // Green
        'persian-green': '#1FA28D',
        'caribbean-green': '#32CD9E',
        'skobeloff': '#026969',

        // white & light-gray
        'cultured': '#E9ECEF',
        'alice-blue': '#DBE9EE',
        'gainsboro': '#DEE2E6',
        'platinum': '#E0E0E0',
        'sea-froth': '#D2DCE5',

        // gray
        'heliotrope': '#A69EA9',
        'roman-silver': '#84828F',
        'jet': '#292929',
        'dark-gray': '#333',

        // Red & Pink
        'pink-silver': '#EBEBEB',

        // Purple
        'english-violet': '#363044',
        'cyber-grape': '#64528E',
        'old-lavender': '#6A687A',
        'mystic-purple': '#39304A',
        'northern-sea-rock': '#3E3F59',
        'indigo-raw': '#4E168A',
        'tekhelet': '#4B257B',
        'iris': '#7248C7',
        'russian-violet': '#3E2966',
        'pale-purple': '#E5D9F2',
        'thistle': '#D6CAE2',
        'dark-purple': '#250C31',
        'wisteria': '#BC96E6',

        // Semantic named colors (matching CSS custom properties)
        'prokope-bg': 'var(--background-color)',
        'prokope-text': 'var(--text-color)',
        'prokope-link': 'var(--link-color)',
        'prokope-link-hover': 'var(--link-hover-color)',
        'prokope-navbar-bg': 'var(--navbar-bg-color)',
        'prokope-navbar-text': 'var(--navbar-text-color)',
        'prokope-navbar-hover': 'var(--navbar-text-hover-color)',
        'prokope-navbar-active': 'var(--navbar-text-active-color)',
        'prokope-footer-bg': 'var(--footer-bg-color)',
        'prokope-footer-text': 'var(--footer-text-color)',
        'prokope-card-bg': 'var(--card-bg-color)',
        'prokope-card-border': 'var(--card-border-color)',
        'prokope-card-text': 'var(--card-text-color)',
        'prokope-card-heading': 'var(--card-heading-color)',
        'prokope-button-bg': 'var(--button-bg-color)',
        'prokope-button-text': 'var(--button-text-color)',
        'prokope-tag-bg': 'var(--tag-bg-color)',
        'prokope-tag-text': 'var(--tag-font-color)',
      },
      fontFamily: {
        'dosis': ['dosis', 'Roboto', 'sans-serif'],
        'exo': ['exo', 'Roboto', 'sans-serif'],
        'expletus': ['expletus-sans', 'serif'],
        'expletus-italic': ['expletus-italic', 'serif'],
        'noto-sans-display': ['noto-sans-display', 'sans-serif'],
        'dosis-bold': ['dosis', 'Roboto', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'prokope-card': '0 15px 10px -10px var(--english-violet)',
        'prokope-banner': '0 5px 5px 1px var(--english-violet)',
        'prokope-image': '0 0 10px 3px var(--english-violet)',
      },
      transitionDuration: {
        '1500': '1500ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}
