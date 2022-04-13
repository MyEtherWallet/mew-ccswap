import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import { VueReCaptcha } from 'vue-recaptcha-v3';

loadFonts();

createApp(App)
  // reCaptcha sitekey for testing
  .use(VueReCaptcha, { siteKey: '6LcOkkwfAAAAAHs-bw2WrXHJtcdDWKl7S4JktET9' })
  //.use(VueReCaptcha, { siteKey: '6LczzE0fAAAAALKiUYa2POyGx41EnRs0zjpAxfOI' })
  .use(vuetify)
  .mount('#app');
