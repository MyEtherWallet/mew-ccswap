<template>
  <div
    class="component--landing-page-old-design"
    :class="[$vuetify.display.mdAndUp ? 'background-lg' : 'background-sm']"
  >
    <div class="background-image pt-15">
      <v-container>
        <v-row>
          <v-col cols="12" md="5" lg="7">
            <HeaderComponent />
          </v-col>
          <v-col cols="12" md="7" lg="5">
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
import { inject } from "vue";

import HeaderComponent from "@/components/Header/HeaderComponent.vue";
import FooterComponent from "@/components/Footer/FooterComponent.vue";
import OrderForm from "@/components/OrderForm/OrderForm.vue";
import BuyFormBanner from "@/components/BuyNowBanner/BuyBanner.vue";
import PromoComponent from "@/components/Promo/PromoComponent.vue";
import PromoComponentThisIsWhy from "@/components/Promo/PromoComponentThisIsWhy.vue";

const amplitude: any = inject("$amplitude");

const VIEWED_CC_SWAP = "CCSwapShown";

const isEthVm = window.location.search.includes("platform=ethvm");
const isEnkrypt = window.location.search.includes("platform=enkrypt");

if (isEthVm) {
  amplitude.track(`${VIEWED_CC_SWAP}EthVM`);
}
if (isEnkrypt) {
  amplitude.track(`${VIEWED_CC_SWAP}Enkrypt`);
}
if (!isEthVm && !isEnkrypt) {
  amplitude.track(`${VIEWED_CC_SWAP}Web`);
}
</script>

<style lang="scss">
@import "@/styles/globalOldDesign.scss";
@import "@/styles/mewDesign.scss";
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
  background-color: rgb(var(--v-theme-background-fill));
  background-image: radial-gradient(
      at top 0px right 200px,
      rgb(var(--v-theme-background-gradient)),
      transparent 900px
    ),
    radial-gradient(
      at bottom 200px left 200px,
      rgba(var(--v-theme-background-gradient)),
      transparent 500px
    ),
    radial-gradient(
      circle at bottom right,
      rgba(var(--v-theme-background-gradient)),
      transparent 300px
    );
}
</style>
