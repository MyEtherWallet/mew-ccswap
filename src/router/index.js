import Vue from 'vue'
import { createWebHistory, createRouter } from "vue-router";
import LandingPage from '@/components/LandingPage.vue'
import OrderStatus from '@/components/Body/OrderStatus/OrderStatus.vue'


Vue.use(createRouter);

const routes = createRouter({
history: createWebHistory(),
routes: [
{ 
    path: '/', 
    name: 'LandingPage', 
    component: LandingPage 
}, 
{ 
    path: '/status/:userId', 
    name: 'OrderStatus', 
    component: OrderStatus, 
    props: true },
{
    path: '*',
    name: 'catchAll',
    component: LandingPage
}
]
});

export default routes