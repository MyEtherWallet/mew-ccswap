<template>
  <div class="promo--bottom py-15">
    <v-container>
      <h1 class="mb-9 text-white">Why millions of users choose us</h1>
      <v-row>
        <v-col
          cols="12"
          md="6"
          sm="6"
          v-for="(p2, key2) in promo2"
          :key="key2"
          :class="['justify-left', 'd-flex']"
        >
          <div class="d-flex align-center pb-8">
            <img class="mr-4" :src="p2.icon" alt="Promo" />
            <div>
              <div class="heading-3 mb-1 text-white">{{ p2.title }}</div>
              <div
                v-if="p2.description"
                style="max-width: 350px; color: #9ba1ae"
                class="heading-5"
              >
                {{ p2.description }}
              </div>
              <div class="text-gray heading-5" v-else style="max-width: 350px">
                Feel free to contact
                <a href="mailto:support@simplex.com">support@mew.com</a>
                should you have questions.
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import iconFee from "@/assets/images/promo/icon-fee.png";
import iconFeeBlue from "@/assets/images/promo/icon-fee-blue.png";
import iconFeeMew from "@/assets/images/promo/icon-fee-mew.png";
import iconQuick from "@/assets/images/promo/icon-quick.png";
import iconQuickBlue from "@/assets/images/promo/icon-quick-blue.png";
import iconQuickMew from "@/assets/images/promo/icon-quick-mew.png";
import iconVerification from "@/assets/images/promo/icon-verification.png";
import iconVerificationBlue from "@/assets/images/promo/icon-verification-blue.png";
import iconVerificationMew from "@/assets/images/promo/icon-verification-mew.png";
import iconSupport from "@/assets/images/promo/icon-support.png";
import iconSupportBlue from "@/assets/images/promo/icon-support-blue.png";
import iconSupportMew from "@/assets/images/promo/icon-support-mew.png";
const isEthVm = window.location.search.includes("platform=ethvm");
const isEnkrypt = window.location.search.includes("platform=enkrypt");

const promo2 = [
  {
    icon: isEthVm ? iconFeeBlue : isEnkrypt ? iconFee : iconFeeMew,
    title: "Low fees",
    description:
      "Get the most crypto for your fiat with limited fees from the provider and MEW",
  },
  {
    icon: isEthVm ? iconQuickBlue : isEnkrypt ? iconQuick : iconQuickMew,
    title: "Quick transactions",
    description: "Get crypto in your wallet in minutes",
  },
  {
    icon: isEthVm
      ? iconVerificationBlue
      : isEnkrypt
      ? iconVerification
      : iconVerificationMew,
    title: "Easy verification",
    description: "Payment is processed in a few short steps",
  },
  {
    icon: isEthVm ? iconSupportBlue : isEnkrypt ? iconSupport : iconSupportMew,
    title: "Human support",
    description: `Reach out to ${
      isEthVm ? "support@ethvm.com" : "support@enkrypt.com"
    } with any questions`,
  },
];
</script>

<style lang="scss" scoped>
.promo--bottom {
  background-color: rgb(var(--v-theme-promo--bottom));
  @media (min-width: 768px) {
    background-image: radial-gradient(
      circle at top right,
      rgb(var(--v-theme-background-gradient)),
      transparent 300px
    );
  }
}

h1 {
  max-width: 600px;
}
</style>
