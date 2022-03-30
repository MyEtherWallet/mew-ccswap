import routes from "./router/index";
import { createApp } from "vue";
import App from "@/App.vue";




const app = createApp(App);
app.use(routes).mount("#app");
