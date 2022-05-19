import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import LandingPage from "@/layouts/LandingPage.vue";
const history =
  process.env.NODE_ENV === "production"
    ? createWebHashHistory("/mew-ccswap/")
    : createWebHistory();
const router = createRouter({
  history: history,
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
  ],
});

export default router;
