<template>
  <div class="dropShadow">
    <img
      :src="isEthVm ? ethvmLogo : isEnkrypt ? enkryptDarkLogo : mewLogo"
      alt="MEW"
      height="36"
    />

    <div
      class="heading-1 text-color"
      :style="
        $vuetify.display.smAndUp
          ? 'margin-top: 100px; max-width: 520px'
          : 'margin-top: 50px;  max-width: 520px'
      "
    >
      Buy and Sell Crypto Fast and Secure
    </div>

    <div class="d-flex align-center" style="margin-top: 60px">
      <div class="text-color mr-4">Powered by</div>
      <img
        class="mr-2"
        :src="isEthVm ? simplexLight : simplex"
        alt="Simplex"
        height="25"
      />
      <img :src="isEthVm ? moonpayWhite : moonpay" alt="Moonpay" height="25" />
    </div>

    <div class="d-flex flex-wrap align-center mt-4">
      <div class="text-color mr-2">We accept</div>
      <div class="d-flex align-center">
        <img class="mr-2" :src="visa" alt="Visa" height="22" />
        <img class="mr-2" :src="applePay" alt="Visa" height="22" />
        <img class="mr-2" :src="paypal" alt="Visa" height="22" />
        <img :src="master" alt="Master" height="22" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import visa from "@/assets/images/icon-visa.svg";
import master from "@/assets/images/icon-master.svg";
import applePay from "@/assets/images/icon-apple-pay.svg";
import paypal from "@/assets/images/icon-paypal-logo.svg";
import simplex from "@/assets/images/icon-simplex.svg";
import simplexLight from "@/assets/images/icon-simplex-light.svg";
import moonpay from "@/assets/images/icon-moonpay.svg";
import moonpayWhite from "@/assets/images/icon-moonpay-white.svg";
import enkryptDarkLogo from "@/assets/images/icon-enkrypt-logo-dark.svg";
import ethvmLogo from "@/assets/images/icon-ethvm-logo.svg";
import mewLogo from "@/assets/images/icon-mew-logo-dark.svg";

const isEthVm = window.location.search.includes("platform=ethvm");
const isEnkrypt = window.location.search.includes("platform=enkrypt");
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 1.6rem;
  line-height: 2.4rem;
  font-weight: 300;
}
.secondaryText {
  width: 79px;
  height: 24px;

  // font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;

  color: #1b1b1b;
}

.text-color {
  color: rgb(var(--v-theme-promo-header-text));
}
</style>
