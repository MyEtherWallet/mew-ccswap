import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import LandingPage from "@/layouts/LandingPage.vue";
const router = createRouter({
  history: process.env.NODE_ENV === 'qa' ? createWebHashHistory() : createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
  ],
});

export default router;
