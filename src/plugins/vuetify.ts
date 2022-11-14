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
  black: '#202030',
  // EthVM
  blue: '#0065FF',
  navy: '#1A2C5C',
};

const enkryptTheme = {
  dark: false,
  colors: {
    purple: COLORS.purple,
    mew: COLORS.mew,
    gray: COLORS.gray,
    black: COLORS.black,
    white: COLORS.white,
  },
  variables: {},
};

const ethvmTheme = {
  dark: false,
  colors: {
    blue: COLORS.blue,
    navy: COLORS.navy,
    mew: COLORS.mew,
    black: COLORS.black,
    white: COLORS.white,
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'enkryptTheme',
    themes: {
      enkryptTheme,
      ethvmTheme,
    },
  },
});
