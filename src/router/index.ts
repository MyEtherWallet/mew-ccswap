import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/layouts/LandingPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
  ],
});

export default router;
