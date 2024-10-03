<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div>
    <div class="d-flex align-center textDark--text mb-10">
      <v-icon color="textDark" class="cursor-pointer" @click="$emit('close')">
        mdi-arrow-left mr-4
      </v-icon>
      <div class="mew-heading-2 provider-text">Select a provider to buy</div>
    </div>
    <div class="mew-heading-2 mb-10">
      Spending {{ formattedFiat }} to buy {{ selectedCrypto.symbol }} on
      {{ selectedNetwork.name_long }} Network
    </div>
    <div
      v-for="(provider, idx) in buyProviders"
      :key="provider.provider + idx"
      class="section-block ripple pa-5 mb-6"
      @click="buy(provider)"
    >
      <div v-if="idx === 0" class="best-rate">Best Rate</div>
      <div>
        <div class="d-flex mew-heading-3">
          {{ provider.crypto_amount }}
          <div class="d-flex align-center">
            <span class="mew-heading-3 pl-1 mr-1">{{
              provider.crypto_currency
            }}</span>
            <v-tooltip location="bottom" min-width="200px">
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
                {{ generateFeeLabel(provider) }}
                <br />
                <br />
                <br />
                {{ generateLimits(provider.provider) }}
                <br />
                {{ generateLimits(provider.provider, false) }}
              </div>
            </v-tooltip>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-3">
          <img
            :src="parseProviderLogo(provider)"
            :alt="provider.provider + ' logo'"
            width="100"
          />
          <div class="d-flex flex-column align-center mb-1">
            <div
              :class="[
                'd-flex align-center mb-1 justify-end',
                $vuetify.display.mdAndDown ? 'flex-wrap' : '',
              ]"
              :style="
                $vuetify.display.mdAndDown ? 'width : 150px;' : 'width: 100%'
              "
            >
              <img
                v-for="(logo, idx) in parsePaymentMethods(
                  provider.payment_methods
                )"
                :key="idx + logo"
                :src="logo"
                :alt="provider.provider + ' payment method'"
                width="40"
                class="mr-1"
              />
            </div>
            <div class="mew-label d-none d-sm-block">
              {{ parsePaymentMethods(provider.payment_methods, true) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-2 text-center mew-label">
      Fees, availability, and purchase limits vary between providers, you can
      check their quotes and select one that works for you.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";

import visaLogo from "@/assets/images/icon-visa.svg";
import mastercardLogo from "@/assets/images/icon-master.svg";
import bankLogo from "@/assets/images/icon-bank.svg";
import applePayLogo from "@/assets/images/icon-apple-pay.svg";
import paypalLogo from "@/assets/images/icon-paypal-logo.svg";
import googlePayLogo from "@/assets/images/icon-google-pay-logo.svg";
import pixLogo from "@/assets/images/icon-pix-logo.svg";

import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/plugins/globalStore";
import { currencySymbols } from "./handler/prices";

import { BuyProviders } from "./types";

const amplitude: any = inject("$amplitude");

const store = useGlobalStore();
const { buyProviders, selectedFiat, selectedCrypto, selectedNetwork } =
  storeToRefs(store);

const amount = computed(() => {
  return buyProviders.value.length > 0 ? buyProviders.value[0].fiat_amount : 0;
});

const formattedFiat = computed(() => {
  const symbol = currencySymbols[selectedFiat.value.name]
    ? currencySymbols[selectedFiat.value.name]
    : "";
  return `${symbol}${amount.value}`;
});

const isEUR = computed(() => {
  return selectedFiat.value.name === "EUR" || selectedFiat.value.name === "GBP";
});

const generateFeeLabel = (provider: BuyProviders) => {
  const feeLabel: { [key: string]: string } = {
    MOONPAY: `Includes ${isEUR.value ? 0.7 : 4.99}% fee`,
    SIMPLEX: "Includes fee 5.25% fee",
    TOPPER: "Includes 4.65% fee. First transaction is free.",
    COINBASE: "Includes 2.5% fee.",
  };

  return feeLabel[provider.provider];
};

const generateLimits = (provider: string, daily = true) => {
  const dailyLimits: { [key: string]: string } = {
    MOONPAY: "Daily limit: $10,000",
    SIMPLEX: "Daily limit: $20,000",
    TOPPER: "Daily limit: $20,000",
    COINBASE: "Daily limit: $20,000",
  };

  const monthlyLimits: { [key: string]: string } = {
    MOONPAY: "Monthly limit: $50,000",
    SIMPLEX: "Monthly limit: $50,000",
    TOPPER: "Monthly limit: $50,000",
    COINBASE: "Monthly limit: $50,000",
  };

  return daily ? dailyLimits[provider] : monthlyLimits[provider];
};

const parseProviderLogo = (provider: BuyProviders) => {
  const providerLogos: { [key: string]: any } = {
    SIMPLEX: require("@/assets/images/icon-simplex.svg"),
    MOONPAY: require("@/assets/images/icon-moonpay.svg"),
    TOPPER: require("@/assets/images/icon-topper.svg"),
    COINBASE: require("@/assets/images/icon-coinbase-light.webp"),
  };
  return providerLogos[provider.provider];
};

const parsePaymentMethods = (
  paymentMethods: Array<string>,
  label = false
): Array<string> | string => {
  const logos: Array<string> = [];
  let paymentMethodsLabel = "";
  if (
    paymentMethods.includes("CREDIT_CARD") ||
    paymentMethods.includes("DEBIT_CARD") ||
    paymentMethods.includes("CARD")
  ) {
    logos.push(visaLogo);
    logos.push(mastercardLogo);
    paymentMethodsLabel += "Visa, Mastercard";
  }

  if (
    (paymentMethods.includes("ACH") ||
      paymentMethods.includes("ACH_BANK_ACCOUNT") ||
      paymentMethods.includes("SEPA_OPEN_BANKING")) &&
    isEUR.value
  ) {
    logos.push(bankLogo);
    paymentMethodsLabel += `${
      paymentMethodsLabel.length > 0 ? ", " : ""
    }Bank account`;
  }

  if (paymentMethods.includes("PAYPAL")) {
    logos.push(paypalLogo);
    paymentMethodsLabel += `${
      paymentMethodsLabel.length > 0 ? ", " : ""
    }Paypal`;
  }

  if (paymentMethods.includes("APPLE_PAY")) {
    logos.push(applePayLogo);
    paymentMethodsLabel += `${
      paymentMethodsLabel.length > 0 ? ", " : ""
    }Apple Pay`;
  }

  if (paymentMethods.includes("GOOGLE_PAY")) {
    logos.push(googlePayLogo);
    paymentMethodsLabel += `${
      paymentMethodsLabel.length > 0 ? ", " : ""
    }Google Pay`;
  }

  if (paymentMethods.includes("PIX")) {
    logos.push(pixLogo);
    paymentMethodsLabel += `${paymentMethodsLabel.length > 0 ? ", " : ""}Pix`;
  }

  return label ? paymentMethodsLabel : logos;
};

const buy = (provider: BuyProviders) => {
  window.open(provider.url, "_blank");
  if (provider.provider === "SIMPLEX") {
    amplitude.track(`CCBuySellBuyWithSimplex`);
  } else if (provider.provider === "MOONPAY") {
    amplitude.track(`CCBuySellBuyWithMoonpay`);
  } else if (provider.provider === "TOPPER") {
    amplitude.track(`CCBuySellBuyWithTopper`);
  } else if (provider.provider === "COINBASE") {
    amplitude.track(`CCBuySellBuyWithCoinbase`);
  }
};
</script>
<style lang="scss" scoped>
$greyLight-base: #f2f3f6;
$greyPrimary-base: #5a678a;
/* Ripple effect */
.ripple {
  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #f2f3f6 radial-gradient(circle, transparent 1%, #f2f3f6 1%)
    center/15000%;
}
.ripple:active {
  background-color: #d7dae3;
  background-size: 100%;
  transition: background 0s;
}
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
  cursor: pointer;
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

.best-rate {
  background-color: #05c0a5 !important;
  text-align: center;
  font-size: small;
  width: 64px;
  border-radius: 4px;
  top: -10px;
  position: absolute;
  color: white;
}

.elevated-box {
  border-radius: 20px;
  background-color: white;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.6) !important;
  // box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.05);
  width: 300px;
}
</style>
<style lang="scss">
.v-tooltip .v-overlay__content {
  background: transparent !important;
}
</style>
