import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

const config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    screens: {
      desktop: {
        max: '1280px',
      },
      laptop: {
        max: '1024px',
      },
      tablet: {
        max: '640px',
      },
    },
    extend: {
      colors: {
        'primary-1': '#4650F0',
        'primary-2': '#5B6AF5',
        'primary-3': '#757FF5',
        'primary-4': '#97A0F8',
        'primary-5': '#AEB4F5',
        'primary-6': '#FFF',
        'text-0': '#000000',
        'text-1': '#17171B',
        'text-2': '#1F2128',
        'text-3': '#272B37',
        'text-4': '#363A42',
        'text-5': '#515261',
        'text-6': '#8A8BA1',
        'text-7': '#B7B8C9',
        'accent-1': '#3F6FFF',
        'accent-2': '#14F0D6',
        'accent-3': '#00CC96',
        'accent-4': '#FF9F15',
        'accent-5': '#FF6A55',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    tailwindAnimate,
    plugin(function addVars({ addBase, theme }) {
      function extractColorVars(
        colorObj: Record<string, any>,
        colorGroup: string,
        start: string,
        end: string,
      ) {
        const keys = Object.keys(colorObj);
        const startIndex = keys.indexOf(start);
        const endIndex = keys.indexOf(end);
        if (startIndex === -1 || endIndex === -1) {
          return {};
        }
        const newColorGroup = colorGroup || '';

        const newColor = Object.fromEntries(
          keys.slice(startIndex + 1, endIndex).map(key => [key, colorObj[key]]),
        );

        return Object.keys(newColor).reduce((vars, colorKey) => {
          const value = newColor[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${newColorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`, start, end);
          Object.assign(vars, newVars);
          return vars;
        }, {});
      }

      addBase({
        ':root': extractColorVars(
          theme('colors'),
          '',
          '/colors-begin',
          '/colors-end',
        ),
      });
    }),
    plugin(function addDirection({ addUtilities }) {
      addUtilities({
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      });
    }),
    plugin(function addBgContainFull({ addUtilities }) {
      addUtilities({
        '.bg-contain-full': {
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      });
      addUtilities({
        '.bg-cover-full': {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      });
    }),
    require('tailwindcss-animate'),
  ],
  corePlugins: {
    preflight: true,
  },
} satisfies Config;

export default config;
