<template>
  <div>
    <img :src="enkryptDarkLogo" alt="MEW" height="36" />

    <div
      :class="$vuetify.display.smAndUp ? 'heading-1' : 'heading-1'"
      style="color: white"
      :style="
        $vuetify.display.smAndUp
          ? 'margin-top: 100px; max-width: 340px'
          : 'margin-top: 50px;  max-width: 340px'
      "
    >
      Buy Ethereum at Lower Rates
    </div>

    <div class="d-flex align-center" style="margin-top: 60px">
      <div class="mr-2" style="color: white">Powered by</div>
      <img :src="simplex" alt="Simplex" height="30" />
      <img :src="moonpay" alt="Moonpay" height="30" />
    </div>

    <div class="d-flex flex-wrap align-center mt-4">
      <div class="mr-2" style="color: white">We accept</div>
      <div class="d-flex align-center">
        <img class="mr-2" :src="visa" alt="Visa" height="22" />
        <img class="mr-2" :src="applePay" alt="Visa" height="22" />
        <img :src="master" alt="Master" height="22" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import visa from '@/assets/images/icon-visa.svg';
import master from '@/assets/images/icon-master.svg';
import applePay from '@/assets/images/icon-apple-pay.svg';
import simplex from '@/assets/images/icon-simplex-white.svg';
import moonpay from '@/assets/images/icon-moonpay-white.svg';
import enkryptDarkLogo from '@/assets/images/icon-enkrypt-logo-dark.svg';
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

.dropShadow {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
</style>
