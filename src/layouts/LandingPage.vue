<template>
  <div
    class="component--landing-page-old-design"
    :class="[$vuetify.display.mdAndUp ? 'background-lg' : 'background-sm']"
  >
    <div class="background-image pt-15">
      <v-container>
        <v-row>
          <v-col cols="12" md="5" lg="6">
            <HeaderComponent />
          </v-col>
          <v-col cols="12" md="7" lg="6">
            <OrderForm />
          </v-col>
        </v-row>
      </v-container>
      <PromoComponent />
    </div>

    <PromoComponentThisIsWhy />
    <BuyFormBanner />
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/Header/HeaderComponent.vue';
import FooterComponent from '@/components/Footer/FooterComponent.vue';
import OrderForm from '@/components/OrderForm/OrderForm.vue';
import BuyFormBanner from '@/components/BuyNowBanner/BuyBanner.vue';
import PromoComponent from '@/components/Promo/PromoComponent.vue';
import PromoComponentThisIsWhy from '@/components/Promo/PromoComponentThisIsWhy.vue';
</script>

<style lang="scss">
@import '@/styles/globalOldDesign.scss';
@import '@/styles/mewDesign.scss';
</style>

<style lang="scss" scoped>
.component--landing-page-old-design {
  min-height: 100vh;
}

.background-lg {
  background-size: 100vw;
  background-position: left 0px top 0px;
}

.background-sm {
  background-size: cover;
  background-position: right top;
}

.background-space-man {
  background-size: 0px;
}

.background-space-man-lg {
  //background-size: 347px;
  //background-position: calc(50% - 43px) 379px;
  background-size: 603px;
  background-position: calc(50% + 854px) 54px;
}

.background-space-man-xl {
  margin: 0 auto;
  max-width: 2565px;
  background-size: 603px;
  background-position: calc(50% + 854px) 54px;
}

.background-image {
  background-color: #161a34;
  background-image: radial-gradient(
      at top 0px right 300px,
      rgb(86, 69, 244),
      transparent 900px
    ),
    radial-gradient(
      at bottom 200px left 200px,
      rgba(109, 99, 196, 0.5),
      transparent 600px
    ),
    radial-gradient(at bottom right, rgba(60, 47, 104, 0.5), transparent 400px);
}

/*
background-image: radial-gradient(
    30% 30% at left 200px bottom 250px,
    #14377a,
    #1d2343
  );
  */
</style>
