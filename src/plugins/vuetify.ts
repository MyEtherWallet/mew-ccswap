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
};

const enkryptTheme = {
  dark: false,
  colors: {
    purple: COLORS.purple,
    mew: COLORS.mew,
    gray: COLORS.gray,
    black: COLORS.black,
  },
  variables: {},
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'enkryptTheme',
    themes: {
      enkryptTheme,
    },
  },
});
