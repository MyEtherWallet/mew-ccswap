import { createWebHistory, createRouter } from "vue-router";
// import store from '@/store/actions'
import xss from 'xss'

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

router.beforeResolve((to, ___, next) => {
  const queryKeys = Object.keys(to.query)
  if (queryKeys.length > 0) {
    const blankObj = {}
    for (const key in to.query) {
      blankObj[key] = xss(to.query[key])
    }
    store.dispatch('saveQueryVal', blankObj)
    next()
  } else {
    next()
  }
})

export default router;
