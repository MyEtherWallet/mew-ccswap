<template>
  <div>
    <img :src="mewDarkLogo" alt="MEW" height="36" />

    <div
      :class="$vuetify.display.smAndUp ? 'heading-1' : 'heading-1'"
      :style="
        $vuetify.display.smAndUp
          ? 'margin-top: 100px; max-width: 340px'
          : 'margin-top: 50px;  max-width: 340px'
      "
    >
      Buy Ethereum at Lower Rates
    </div>

    <div class="d-flex align-center" style="margin-top: 60px">
      <div class="mr-2 text--secondary">Powered by</div>
      <img :src="simplex" alt="Simplex" height="30" />
    </div>

    <div class="d-flex flex-wrap align-center mt-4">
      <div class="mr-2 text--secondary">
        We accept
        <u class="font-weight-medium text--secondary"> Visa </u>
        ,
        <u class="font-weight-medium text--secondary"> Apple Pay </u>
        and
        <u class="font-weight-medium text--secondary"> MasterCard </u>
      </div>
      <div class="d-flex align-center">
        <img class="mr-2" :src="visa" alt="Visa" height="22" />
        <img class="mr-2" :src="applePay" alt="Visa" height="22" />
        <img :src="master" alt="Master" height="22" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import visa from "@/assets/images/icon-visa.svg";
import master from "@/assets/images/icon-master.svg";
import applePay from "@/assets/images/icon-apple-pay.svg";
import simplex from "@/assets/images/icon-simplex.svg";
import mewDarkLogo from "@/assets/images/icon-mew-logo-dark.svg";
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 1.6rem;
  line-height: 2.4rem;
  font-weight: 300;
}
</style>
