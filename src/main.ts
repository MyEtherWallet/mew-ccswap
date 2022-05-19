import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

createApp({
  render: () => h(App),
})
  .use(router)
  .use(store)
  .use(vuetify)
  .mount("#app");
