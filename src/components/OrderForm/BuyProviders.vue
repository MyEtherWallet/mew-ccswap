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
      Spending {{ formattedFiat }}
    </div>
    <div
      v-for="(provider, idx) in buyProviders"
      :key="provider.provider + idx"
      class="section-block pa-5 mb-6"
    >
      <img
        class="provider-logo"
        :src="parseProviderLogo(provider)"
        :alt="provider.provider + ' logo'"
        width="140"
      />
      <div class="mb-3">
        <div class="d-flex mb-1 align-center justify-space-between">
          <div class="d-flex mew-heading-3">
            {{ provider.crypto_amount }}
            <div class="d-flex align-center">
              <span class="mew-heading-3 pl-1 mr-1">{{
                provider.crypto_currency
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
        </div>
      </div>
      <div class="d-flex align-center mb-1">
        <img
          v-for="(logo, idx) in parsePaymentMethods(provider.payment_methods)"
          :key="idx"
          :src="logo"
          :alt="provider.provider + ' payment method'"
          height="24"
          class="mr-2"
        />
      </div>
      <div class="mew-label mb-5">
        {{ parsePaymentMethods(provider.payment_methods, true) }}
      </div>
      <div>
        <v-btn
          size="large"
          class="grey-light greyPrimary--text"
          width="100%"
          variant="flat"
          @click="buy(provider)"
          >BUY WITH {{ provider.provider.toUpperCase() }}</v-btn
        >
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
const { buyProviders, selectedFiat } = storeToRefs(store);

const formattedFiat = computed(() => {
  const amount =
    buyProviders.value.length > 0 ? buyProviders.value[0].fiat_amount : 0;
  return `${currencySymbols[selectedFiat.value.name]}${amount}`;
});

const isEUR = computed(() => {
  return selectedFiat.value.name === "EUR" || selectedFiat.value.name === "GBP";
});

const generateFeeLabel = (provider: BuyProviders) => {
  const percentFee = {
    MOONPAY: isEUR.value ? 0.7 : 4.99,
  };
  const feeLabel: { [key: string]: string } = {
    MOONPAY: `Includes ${percentFee}% fee`,
    SIMPLEX: "Includes fee 5.25% fee",
    TOPPER: "Includes 4.65% fee. First transaction is free.",
    COINBASE: "Includes 4.65% fee.",
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
    TOPPER: require("@/assets/images/icon-topper.png"),
    COINBASE: require("@/assets/images/icon-coinbase.svg"),
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
      paymentMethods.includes("ACH_BANK_ACCOUNT")) &&
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
