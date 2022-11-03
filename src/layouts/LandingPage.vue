<template>
  <div
    class="pt-15 component--landing-page-old-design"
    :class="[$vuetify.display.mdAndUp ? 'background-lg' : 'background-sm']"
    :style="{ 'background-image': `url(${bgBar})` }"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="5" lg="7">
          <HeaderComponent />
        </v-col>
        <v-col cols="12" md="7" lg="5">
          <OrderForm />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <PromoComponent />
        </v-col>
      </v-row>
    </v-container>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from "@/components/Header/HeaderComponent.vue";
import FooterComponent from "@/components/Footer/FooterComponent.vue";
import OrderForm from "@/components/OrderForm/OrderForm.vue";
import PromoComponent from "@/components/Promo/PromoComponent.vue";
import bgBar from "@/assets/images/bg-bar-old.svg";
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
</style>
