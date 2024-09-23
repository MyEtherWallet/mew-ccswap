import { createApp, h } from "vue";
import * as amplitude from '@amplitude/analytics-browser';
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";


amplitude.init(
  "f90fa07c6624d9c3273268b866fc8788733e4dbac6feb32a420949e8bd45331f",
  {
    instanceName:
      process.env.NODE_ENV === "production" ? "mew-web-prod" : "mew-web-dev",
    optOut: false,
    serverUrl:
      process.env.NODE_ENV === "production"
        ? "https://analytics-web.mewwallet.dev/record"
        : "https://analytics-web-development.mewwallet.dev/record",
    appVersion: "0.0.1",
    trackingOptions: {
      ipAddress: false,
    },
    identityStorage: "none",
    logLevel: amplitude.Types.LogLevel.None,
    defaultTracking: {
      formInteractions: false,
      pageViews: false
    }
  },
);


loadFonts();

const pinia = createPinia();

createApp({
  render: () => h(App),
})
  .use(router)
  .use(store)
  .use(vuetify)
  .use(pinia)
  .provide("$amplitude", amplitude)
  .mount("#app");
