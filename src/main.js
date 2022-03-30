import routes from "./router/index";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import BuyCrypto from "@/components/Body/BuyCrypto/BuyCrypto.vue";
import CheckoutForm from "@/components/Body/CheckoutForm/CheckoutForm.vue";
import Promo1 from "@/components/Body/promo1/Promo1.vue";
import Promo2 from "@/components/Body/promo2/Promo2.vue";

// import Vue from "vue";
import { createApp } from "vue";
import App from "@/App.vue";

// Vue.component("page-header", Header);
// Vue.component("page-footer", Footer);
// Vue.component("buy-crypto", BuyCrypto);
// Vue.component("checkout-form", CheckoutForm);
// Vue.component("promo1", Promo1);
// Vue.component("promo2", Promo2);

// Vue.config.productionTip = false;

const app = createApp(App);
app.use(routes).mount("#app");
