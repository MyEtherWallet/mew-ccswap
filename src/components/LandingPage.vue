<script setup lang="js">
import PageHeader from "./Header/Header.vue";
import BuyCrypto from "./Body/BuyCrypto/BuyCrypto.vue";
import Promo1 from "./Body/promo1/Promo1.vue";
import Promo2 from "./Body/promo2/Promo2.vue";
import PageFooter from "./Footer/Footer.vue";

export default {
    components: {
        PageHeader,
        BuyCrypto,
        Promo1,
        Promo2,
        PageFooter
    }
}
</script>

<template>
<div class="landing-page">
    <PageHeader />
    <BuyCrypto />
    <Promo1 />
    <Promo2 />
    <PageFooter />
</div>
</template>

<style lang="scss" scoped>
@import "@/var.scss";
@import "LandingPage.scss";
</style>
