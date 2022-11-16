<template>
  <div class="promo--bottom py-15">
    <v-container>
      <h1 class="mb-9 text-white">Why millions of users choose us</h1>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="(p2, key2) in promo2"
          :key="key2"
          :class="$vuetify.display.mdAndUp ? '' : 'd-flex justify-center'"
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
import iconQuick from "@/assets/images/promo/icon-quick.png";
import iconVerification from "@/assets/images/promo/icon-verification.png";
import iconSupport from "@/assets/images/promo/icon-support.png";
const promo2 = [
  {
    icon: iconFee,
    title: "Low fee",
    description:
      "Get the most crypto for your fiat with limited fees from the provider and MEW",
  },
  {
    icon: iconQuick,
    title: "Quick transactions",
    description: "Get crypto in your wallet in minutes",
  },
  {
    icon: iconVerification,
    title: "Easy verification",
    description: "Payment is processed in a few short steps",
  },
  {
    icon: iconSupport,
    title: "Human support",
    description: "Reach out to support@ethvm.com with any questions",
  },
];
</script>

<style lang="scss" scoped>
$purple: #7b61ff;
.promo--bottom {
  background-color: black;
}

h1 {
  max-width: 600px;
}
</style>
