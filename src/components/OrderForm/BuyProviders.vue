<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div>
    <div class="d-flex align-center textDark--text mb-10">
      <v-icon color="textDark" class="cursor-pointer" @click="$emit('close')">
        mdi-arrow-left mr-4
      </v-icon>
      <div class="mew-heading-2 provider-text">Select provider</div>
    </div>
    <div class="mew-heading-2 font-weight-regular pb-2">
      Spending <b>{{ formattedFiat }}</b>
    </div>
    <div v-if="!processingBuy">
      <!-- ============================================================== -->
      <!-- Moonpay -->
      <!-- ============================================================== -->
      <div v-if="disableMoonpay" class="section-block pa-5 mb-6">
        <img
          class="provider-logo"
          :src="moonpayLogo"
          alt="Moonpay"
          height="28"
        />
        <div v-if="!loading" class="mb-3">
          <div class="d-flex mb-1 align-center justify-space-between">
            <div class="d-flex mew-heading-3">
              {{ moonpayQuote.cryptoToFiat }}
              <div class="d-flex align-center">
                <span class="mew-heading-3 pl-1 mr-1">{{
                  selectedCryptoName
                }}</span>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      color="grey-lighten-1"
                      size="x-small"
                      class="cursor-pointer"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                  <div class="elevated-box pa-3">
                    {{ moonpayQuote.includesFeeText }}
                    <br />
                    <br />
                    {{ moonpayQuote.networkFeeText }}
                    <br />
                    <br />
                    {{ moonpayQuote.dailyLimit }}
                    <br />
                    {{ moonpayQuote.monthlyLimit }}
                  </div>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex align-center mb-1">
          <img :src="visaIcon" alt="Visa" height="24" class="mr-2" />
          <img :src="masterIcon" alt="Master" height="24" class="mr-2" />
          <img :src="applePayIcon" alt="ApplePay" height="24" class="mr-2" />
          <img :src="paypalIcon" alt="Paypal" height="32" class="mr-2" />
          <img v-if="isEUR" :src="bankIcon" alt="Bank" height="24" />
        </div>
        <div class="mew-label mb-5">
          {{ paymentOptionString }}
        </div>
        <div>
          <v-btn
            size="large"
            class="grey-light greyPrimary--text"
            width="100%"
            variant="flat"
            @click.native="buy"
            >{{ moonpayBtnTitle }}</v-btn
          >
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- Simplex -->
      <!-- ============================================================== -->
      <div v-if="disableSimplex" class="section-block pa-5 mb-6">
        <div v-if="!loading" class="mb-3">
          <div class="d-flex mb-1 align-center justify-space-between">
            <div class="d-flex mew-heading-3">
              {{ simplexQuote.cryptoToFiat }}
              <div class="d-flex align-center">
                <span :class="['mew-heading-3 pl-1 mr-1']">{{
                  selectedCryptoName
                }}</span>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      color="grey-lighten-1"
                      size="x-small"
                      class="cursor-pointer"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                  <div class="elevated-box pa-3">
                    {{ simplexQuote.includesFeeText }}
                    <br />
                    <br />
                    {{ simplexQuote.networkFeeText }}
                    <br />
                    <br />
                    {{ simplexQuote.dailyLimit }}
                    <br />
                    {{ simplexQuote.monthlyLimit }}
                  </div>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mb-3">
          <!-- v-skeleton-loader is not supported in Vuetify 3 -->
          <!-- <v-skeleton-loader type="heading" class="mb-1" />
          <v-skeleton-loader max-width="200px" type="heading" /> -->
        </div>

        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center mb-1">
            <img :src="visaIcon" alt="Visa" height="24" class="mr-2" />
            <img :src="masterIcon" alt="Master" height="24" class="mr-2" />
          </div>
          <img
            class="provider-logo"
            :src="simplexLogo"
            alt="Simplex"
            height="28"
          />
        </div>
        <div class="mew-label mb-5">Visa, Mastercard</div>
        <div>
          <v-btn
            size="large"
            class="grey-light greyPrimary--text"
            width="100%"
            variant="flat"
            @click.native="openSimplex"
            >{{ simplexBtnTitle }}</v-btn
          >
        </div>
      </div>
      <!-- ============================================================== -->
      <!-- Topper -->
      <!-- ============================================================== -->
      <div v-if="disableTopper" class="section-block pa-5">
        <div v-if="!loading" class="mb-3">
          <div class="d-flex mb-1 align-center justify-space-between">
            <div class="d-flex mew-heading-3">
              {{ topperQuote.cryptoToFiat }}
              <div class="d-flex align-center">
                <span :class="['mew-heading-3 pl-1 mr-1']">{{
                  selectedCryptoName
                }}</span>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      color="grey-lighten-1"
                      size="x-small"
                      class="cursor-pointer"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                  <div class="elevated-box pa-3">
                    {{ topperQuote.includesFeeText }}
                    <br />
                    <br />
                    {{ topperQuote.networkFeeText }}
                    <br />
                    <br />
                    {{ topperQuote.dailyLimit }}
                    <br />
                    {{ topperQuote.monthlyLimit }}
                  </div>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mb-3">
          <!-- v-skeleton-loader is not supported in Vuetify 3 -->
          <!-- <v-skeleton-loader type="heading" class="mb-1" />
          <v-skeleton-loader max-width="200px" type="heading" /> -->
        </div>

        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center mb-1">
            <img :src="visaIcon" alt="Visa" height="24" class="mr-2" />
            <img :src="masterIcon" alt="Master" height="24" class="mr-2" />
            <img :src="applePayIcon" alt="ApplePay" height="24" class="mr-2" />
            <img
              :src="googlePayIcon"
              alt="googlePay"
              height="35"
              class="mr-2"
            />
            <img :src="pixIcon" alt="pixpay" height="24" class="mr-2" />
          </div>
          <img
            class="provider-logo"
            :src="topperLogo"
            alt="Simplex"
            height="28"
          />
        </div>
        <div class="mew-label mb-5">
          Visa, Mastercard, Apple Pay, Google Pay, Pix
        </div>
        <div>
          <v-btn
            size="large"
            class="grey-light greyPrimary--text"
            width="100%"
            variant="flat"
            @click.native="openTopper"
            >{{ topperBtnTitle }}</v-btn
          >
        </div>
      </div>

      <div class="pt-2 text-center mew-label">
        Fees, availability, and purchase limits vary between providers, you can
        check their quotes and select one that works for you.
      </div>
    </div>
    <div v-else class="text-center py-5">
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

<script lang="ts">
import MultiCoinValidator from "multicoin-address-validator";
import {
  executeSimplexPayment,
  executeMoonpayBuy,
  executeTopperPayment,
} from "./order";
import { defineComponent, inject } from "vue";
import BigNumber from "bignumber.js";

export default defineComponent({
  name: "BuyProviders",
  props: {
    orderHandler: {
      type: Object,
      default: () => ({}),
    },
    close: {
      type: Function,
      default: () => ({}),
    },
    onlySimplex: {
      type: Boolean,
      default: false,
    },
    selectedFiat: {
      type: Object,
      default: () => ({}),
    },
    selectedCurrency: {
      type: Object,
      default: () => ({}),
    },
    moonpayQuote: {
      type: Object,
      default: () => ({}),
    },
    simplexQuote: {
      type: Object,
      default: () => ({}),
    },
    topperQuote: {
      type: Object,
      default: () => ({}),
    },
    toAddress: {
      type: String,
      default: "",
    },
    fiatAmount: {
      type: String,
      default: "0",
    },
  },
  setup() {
    const amplitude: any = inject("$amplitude");
    return { amplitude };
  },
  data() {
    return {
      loading: false,
      processingBuy: false,
    };
  },
  computed: {
    formattedFiat(): string {
      return (
        this.simplexQuote.fiatAmountF ||
        this.moonpayQuote.fiatAmountF ||
        this.topperQuote.fiatAmountF
      );
    },
    selectedFiatName(): string {
      return this.selectedFiat.name;
    },
    actualAddress(): string {
      return this.toAddress;
    },
    selectedCryptoName(): string {
      return this.selectedCurrency.symbol;
    },
    isEUR(): boolean {
      return this.selectedFiatName === "EUR" || this.selectedFiatName === "GBP";
    },
    disableMoonpay(): boolean {
      if (
        BigNumber(
          this.moonpayQuote.cryptoToFiat.replace(",", "")
        ).isGreaterThan(0)
      ) {
        return BigNumber(this.fiatAmount).gte(this.moonpayQuote.min);
      }
      return false;
    },
    disableSimplex(): boolean {
      if (
        BigNumber(
          this.simplexQuote.cryptoToFiat.replace(",", "")
        ).isGreaterThan(0)
      ) {
        return BigNumber(this.fiatAmount).gte(this.simplexQuote.min);
      }
      return false;
    },
    disableTopper(): boolean {
      if (
        BigNumber(this.topperQuote.cryptoToFiat.replace(",", "")).isGreaterThan(
          0
        )
      ) {
        return BigNumber(this.fiatAmount).gte(this.topperQuote.min);
      }
      return false;
    },
    simplexBtnTitle(): string {
      return "BUY WITH SIMPLEX";
    },
    topperBtnTitle(): string {
      return "BUY WITH TOPPER";
    },
    moonpayBtnTitle(): string {
      return "BUY WITH MOONPAY";
    },
    paymentOptionString(): string {
      return `Visa, Mastercard, Apple Pay, Paypal${
        this.isEUR ? ", Bank account" : ""
      }`;
    },
    visaIcon(): string {
      return require("@/assets/images/icon-visa.svg");
    },
    masterIcon(): string {
      return require("@/assets/images/icon-master.svg");
    },
    bankIcon(): string {
      return require("@/assets/images/icon-bank.svg");
    },
    applePayIcon(): string {
      return require("@/assets/images/icon-apple-pay.svg");
    },
    paypalIcon(): string {
      return require("@/assets/images/icon-paypal-logo.svg");
    },
    googlePayIcon(): string {
      return require("@/assets/images/icon-google-pay-logo.svg");
    },
    pixIcon(): string {
      return require("@/assets/images/icon-pix-logo.svg");
    },
    simplexLogo(): string {
      return require("@/assets/images/icon-simplex.svg");
    },
    moonpayLogo(): string {
      return require("@/assets/images/icon-moonpay.svg");
    },
    topperLogo(): string {
      return require("@/assets/images/icon-topper.png");
    },
  },
  methods: {
    isValidToAddress(address: string) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
    },
    // Simplex buy
    openSimplex() {
      this.processingBuy = true;
      this.amplitude.track(`CCBuySellBuyWithSimplex`);
      executeSimplexPayment(
        this.selectedFiatName,
        this.selectedCryptoName,
        this.selectedFiatName,
        this.simplexQuote.fiatAmount,
        this.actualAddress
      )
        .then((data) => {
          window.open(data, "_blank");
          this.reset(true);
          this.close();
          this.$emit("reset");
          this.amplitude.track(`CCBuySellBuyWithSimplexSuccess`);
        })
        .catch(() => {
          this.reset();
          this.close();
          this.$emit("reset");
          this.amplitude.track(`CCBuySellBuyWithSimplexFailed`);
        });
    },
    openTopper() {
      this.processingBuy = true;
      this.amplitude.track(`CCBuySellBuyWithTopper`);
      executeTopperPayment(
        this.selectedFiatName,
        this.selectedCryptoName,
        this.simplexQuote.fiatAmount,
        this.actualAddress
      )
        .then((data) => {
          window.open(data.url, "_blank");
          this.amplitude.track(`CCBuySellBuyWithTopperSuccess`);
          this.reset();
          this.close();
          this.$emit("reset");
        })
        .catch(() => {
          this.reset();
          this.close();
          this.$emit("reset");
          this.amplitude.track(`CCBuySellBuyWithTopperFailed`);
        });
    },
    currencyFormatter(value: number) {
      const locale = "en-US";
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: this.selectedFiatName,
      }).format(value);
    },
    reset(isPurchasing = false) {
      this.loading = true;
      this.processingBuy = isPurchasing;
    },
    // Moonpay buy
    buy() {
      this.processingBuy = true;
      this.amplitude.track(`CCBuySellBuyWithMoonpay`);
      executeMoonpayBuy(
        this.selectedCryptoName,
        this.selectedFiatName,
        this.moonpayQuote.fiatAmount,
        this.actualAddress
      )
        .then((data) => {
          window.open(data, "_blank");
          this.reset(true);
          this.close();
          this.$emit("reset");
          this.amplitude.track(`CCBuySellBuyWithMoonpaySuccess`);
        })
        .catch(() => {
          this.reset();
          this.close();
          this.$emit("reset");
          this.amplitude.track(`CCBuySellBuyWithMoonpayFailed`);
        });
    },
  },
});
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
