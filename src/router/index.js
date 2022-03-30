import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: () => import("@/components/LandingPage.vue"),
  },
  {
    path: "/status/:userId",
    name: "OrderStatus",
    component: () => import("@/components/Body/OrderStatus/OrderStatus.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "catchAll",
    component: () => import("@/components/LandingPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
