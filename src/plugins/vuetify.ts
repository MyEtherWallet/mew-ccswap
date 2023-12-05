import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

const COLORS = {
  // Enkrypt
  white: '#FFFFFF',
  purple: '#7B61FF',
  mew: '#05c0a5',
  gray: '#8799ab',
  'black-1': '#202030',
  'black': '#000',
  // EthVM
  blue: '#0065FF',
  navy: '#1A2C5C',
  'purple-linear-1': '#C549FF',
  'purple-linear-2': '#704BFF',
  // Shared colors
  'grey-1': '#1B1B1B',
  'dark-blue': '#1A2C5C',
  'dark-blue-2': '#1D2342',
  'grey-2': '#797982'

};

const enkryptTheme = {
  dark: false,
  colors: {
    purple: COLORS.purple,
    mew: COLORS.mew,
    gray: COLORS.gray,
    'promo--bottom': COLORS['grey-1'],
    'buynow--banner': COLORS.purple,
    'buynow--banner-btn-text': COLORS.purple,
    'buynow--banner-btn': COLORS.white,
    'btn-linear-1': COLORS['purple-linear-1'],
    'btn-linear-2': COLORS['purple-linear-2'],
    'btn-get-wallet': COLORS.purple,
    'promo-border': COLORS.purple,
    'promo-header-text': COLORS['grey-1'],
    'background-fill': COLORS.white,
    'background-gradient': COLORS.purple,
    black: COLORS['black-1'],
    white: COLORS.white,
    blue: COLORS.blue,
    navy: COLORS.navy,
    'grey-1': COLORS['grey-1'],
    'grey-2': COLORS['grey-2']
  },
};

const ethvmTheme = {
  dark: false,
  colors: {
    blue: COLORS.blue,
    navy: COLORS.navy,
    mew: COLORS.mew,
    black: COLORS['black-1'],
    'promo--bottom': COLORS['black'],
    'buynow--banner': COLORS['dark-blue'],
    'buynow--banner-btn-text': COLORS.white,
    'buynow--banner-btn': COLORS.blue,
    'btn-linear-1': COLORS.blue,
    'btn-linear-2': COLORS.blue,
    'btn-get-wallet': COLORS.blue,
    'promo-border': COLORS.blue,
    'promo-header-text': COLORS.white,
    'background-fill': COLORS['dark-blue-2'],
    'background-gradient': COLORS.blue,
    white: COLORS.white,
    'grey-1': COLORS['grey-1'],
    'grey-2': COLORS['grey-2']
  },
};
const mewTheme = {
  dark: false,
  colors: {
    blue: COLORS.blue,
    navy: COLORS.navy,
    mew: COLORS.mew,
    black: COLORS['black-1'],
    'promo--bottom': COLORS['dark-blue-2'],
    'buynow--banner': COLORS.mew,
    'buynow--banner-btn-text': COLORS.mew,
    'buynow--banner-btn': COLORS.white,
    'btn-linear-1': COLORS.mew,
    'btn-linear-2': COLORS.mew,
    'btn-get-wallet': COLORS.mew,
    'promo-border': COLORS.mew,
    'promo-header-text': COLORS.black,
    'background-fill': COLORS.white,
    'background-gradient': COLORS.mew,
    white: COLORS.white,
    'grey-1': COLORS['grey-1'],
    'grey-2': COLORS['grey-2']
  },
};

const q = window.location.search;
const defaultTheme = q.includes('ethvm') ? 'ethvmTheme' : q.includes('mew') ? 'mewTheme' : 'enkryptTheme';

export default createVuetify({
  components,
  directives,
  options: { customProperties: true },
  theme: {
    defaultTheme: defaultTheme,
    themes: {
      enkryptTheme,
      ethvmTheme,
      mewTheme
    },
  },
});
