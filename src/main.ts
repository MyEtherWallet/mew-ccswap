import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import * as amplitude from '@amplitude/analytics-browser';


amplitude.init(
  "f90fa07c6624d9c3273268b866fc8788733e4dbac6feb32a420949e8bd45331f",
  {
    instanceName:
      process.env.MODE === "production" ? "mew-web-prod" : "mew-web-dev",
    optOut: false,
    serverUrl:
      process.env.MODE === "production"
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

createApp({
  render: () => h(App),
})
  .use(router)
  .use(store)
  .use(vuetify)
  .provide("$amplitude", amplitude)
  .mount("#app");
