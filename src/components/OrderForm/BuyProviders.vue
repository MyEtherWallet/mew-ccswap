<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div>
    <div class="d-flex align-center textDark--text mb-10">
      <v-icon color="textDark" class="cursor-pointer" @click="$emit('close')">
        mdi-arrow-left mr-4
      </v-icon>
      <div class="mew-heading-2 provider-text">Select provider</div>
    </div>
    <div class="mew-heading-2 font-weight-regular pb-2">Spending</div>

    <div class="text-center py-5">
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        color="#05c0a5"
      ></v-progress-circular>
      <div
        class="text-center font-weight-bold mt-3"
        style="line-height: 1.4rem"
      >
        Processing purchase....
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import MultiCoinValidator from "multicoin-address-validator";
// import {
//   executeSimplexPayment,
//   executeMoonpayBuy,
//   executeTopperPayment,
// } from "./handler/order";
// import { defineComponent, inject } from "vue";
import BigNumber from "bignumber.js";

import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/plugins/globalStore";

const store = useGlobalStore();
const { buyProviders } = storeToRefs(store);
console.log(buyProviders);

// export default defineComponent({
//   name: "BuyProviders",
//   props: {
//     close: {
//       type: Function,
//       default: () => ({}),
//     },
//     onlySimplex: {
//       type: Boolean,
//       default: false,
//     },
//     selectedFiat: {
//       type: Object,
//       default: () => ({}),
//     },
//     selectedCurrency: {
//       type: Object,
//       default: () => ({}),
//     },
//     moonpayQuote: {
//       type: Object,
//       default: () => ({}),
//     },
//     simplexQuote: {
//       type: Object,
//       default: () => ({}),
//     },
//     topperQuote: {
//       type: Object,
//       default: () => ({}),
//     },
//     toAddress: {
//       type: String,
//       default: "",
//     },
//     fiatAmount: {
//       type: String,
//       default: "0",
//     },
//   },
//   setup() {
//     const amplitude: any = inject("$amplitude");
//     return { amplitude };
//   },
//   data() {
//     return {
//       loading: false,
//       processingBuy: false,
//     };
//   },
//   computed: {
//     formattedFiat(): string {
//       const amount = BigNumber(this.simplexQuote.cryptoToFiat).isGreaterThan(0)
//         ? this.simplexQuote.fiatAmountF
//         : BigNumber(this.moonpayQuote.cryptoToFiat).isGreaterThan(0)
//         ? this.moonpayQuote.fiatAmountF
//         : this.topperQuote.fiatAmountF;
//       return amount;
//     },
//     selectedFiatName(): string {
//       return this.selectedFiat.name;
//     },
//     actualAddress(): string {
//       return this.toAddress;
//     },
//     selectedCryptoName(): string {
//       return this.selectedCurrency.symbol;
//     },
//     isEUR(): boolean {
//       return this.selectedFiatName === "EUR" || this.selectedFiatName === "GBP";
//     },
//     disableMoonpay(): boolean {
//       if (
//         BigNumber(
//           this.moonpayQuote.cryptoToFiat.replace(",", "")
//         ).isGreaterThan(0)
//       ) {
//         return BigNumber(this.fiatAmount).gte(this.moonpayQuote.min);
//       }
//       return false;
//     },
//     disableSimplex(): boolean {
//       if (
//         BigNumber(
//           this.simplexQuote.cryptoToFiat.replace(",", "")
//         ).isGreaterThan(0)
//       ) {
//         return BigNumber(this.fiatAmount).gte(this.simplexQuote.min);
//       }
//       return false;
//     },
//     disableTopper(): boolean {
//       if (
//         BigNumber(this.topperQuote.cryptoToFiat.replace(",", "")).isGreaterThan(
//           0
//         )
//       ) {
//         return BigNumber(this.fiatAmount).gte(this.topperQuote.min);
//       }
//       return false;
//     },
//     simplexBtnTitle(): string {
//       return "BUY WITH SIMPLEX";
//     },
//     topperBtnTitle(): string {
//       return "BUY WITH TOPPER";
//     },
//     moonpayBtnTitle(): string {
//       return "BUY WITH MOONPAY";
//     },
//     paymentOptionString(): string {
//       return `Visa, Mastercard, Apple Pay, Paypal${
//         this.isEUR ? ", Bank account" : ""
//       }`;
//     },
//     visaIcon(): string {
//       return require("@/assets/images/icon-visa.svg");
//     },
//     masterIcon(): string {
//       return require("@/assets/images/icon-master.svg");
//     },
//     bankIcon(): string {
//       return require("@/assets/images/icon-bank.svg");
//     },
//     applePayIcon(): string {
//       return require("@/assets/images/icon-apple-pay.svg");
//     },
//     paypalIcon(): string {
//       return require("@/assets/images/icon-paypal-logo.svg");
//     },
//     googlePayIcon(): string {
//       return require("@/assets/images/icon-google-pay-logo.svg");
//     },
//     pixIcon(): string {
//       return require("@/assets/images/icon-pix-logo.svg");
//     },
//     simplexLogo(): string {
//       return require("@/assets/images/icon-simplex.svg");
//     },
//     moonpayLogo(): string {
//       return require("@/assets/images/icon-moonpay.svg");
//     },
//     topperLogo(): string {
//       return require("@/assets/images/icon-topper.png");
//     },
//   },
//   methods: {
//     isValidToAddress(address: string) {
//       return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
//     },
//     // Simplex buy
//     openSimplex() {
//       this.processingBuy = true;
//       this.amplitude.track(`CCBuySellBuyWithSimplex`);
//       executeSimplexPayment(
//         this.selectedFiatName,
//         this.selectedCryptoName,
//         this.selectedFiatName,
//         this.simplexQuote.fiatAmount,
//         this.actualAddress
//       )
//         .then((data) => {
//           window.open(data, "_blank");
//           this.reset(true);
//           this.close();
//           this.$emit("reset");
//           this.amplitude.track(`CCBuySellBuyWithSimplexSuccess`);
//         })
//         .catch(() => {
//           this.reset();
//           this.close();
//           this.$emit("reset");
//           this.amplitude.track(`CCBuySellBuyWithSimplexFailed`);
//         });
//     },
//     openTopper() {
//       this.processingBuy = true;
//       this.amplitude.track(`CCBuySellBuyWithTopper`);
//       executeTopperPayment(
//         this.selectedFiatName,
//         this.selectedCryptoName,
//         this.topperQuote.fiatAmount,
//         this.actualAddress
//       )
//         .then((data) => {
//           window.open(data.url, "_blank");
//           this.amplitude.track(`CCBuySellBuyWithTopperSuccess`);
//           this.reset();
//           this.close();
//           this.$emit("reset");
//         })
//         .catch(() => {
//           this.reset();
//           this.close();
//           this.$emit("reset");
//           this.amplitude.track(`CCBuySellBuyWithTopperFailed`);
//         });
//     },
//     currencyFormatter(value: number) {
//       const locale = "en-US";
//       return new Intl.NumberFormat(locale, {
//         style: "currency",
//         currency: this.selectedFiatName,
//       }).format(value);
//     },
//     reset(isPurchasing = false) {
//       this.loading = true;
//       this.processingBuy = isPurchasing;
//     },
//     // Moonpay buy
//     buy() {
//       this.processingBuy = true;
//       this.amplitude.track(`CCBuySellBuyWithMoonpay`);
//       executeMoonpayBuy(
//         this.selectedCryptoName,
//         this.selectedFiatName,
//         this.moonpayQuote.fiatAmount,
//         this.actualAddress
//       )
//         .then((data) => {
//           window.open(data, "_blank");
//           this.reset(true);
//           this.close();
//           this.$emit("reset");
//           this.amplitude.track(`CCBuySellBuyWithMoonpaySuccess`);
//         })
//         .catch(() => {
//           this.reset();
//           this.close();
//           this.$emit("reset");
//           this.amplitude.track(`CCBuySellBuyWithMoonpayFailed`);
//         });
//     },
//   },
// });
</script>
<style lang="scss" scoped>
$greyLight-base: #f2f3f6;
$greyPrimary-base: #5a678a;
.section-block {
  border-radius: 12px;
  left: 0px;
  top: 0px;
  box-sizing: border-box;
  border: 1px solid #d7dae3;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  position: relative;
}
.provider-logo {
  position: absolute;
  top: 18px;
  right: 20px;
}
.grey-light {
  background-color: $greyLight-base !important;
  border-color: $greyLight-base !important;
}
.greyPrimary--text {
  color: $greyPrimary-base !important;
  caret-color: $greyPrimary-base !important;
}

.provider-text {
  text-align: center;
  width: 100%;
  padding-right: 20px;
}
</style>
<style lang="scss">
.v-tooltip .v-overlay__content {
  background: transparent !important;
}
</style>
