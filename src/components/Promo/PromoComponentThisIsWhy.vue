<template>
  <div class="promo--bottom py-15">
    <v-container>
      <h1 class="mb-9 text-purple">
        That is the reason why millions of our users choose
      </h1>
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
    title: "Reasonable fee",
    description:
      "Extra charges apply in addition to the rate provided, including a 1.75% MyEtherWallet fee.",
  },
  {
    icon: iconQuick,
    title: "Quick transactions",
    description:
      "We offer lightning-fast transactions typically taking just minutes.",
  },
  {
    icon: iconVerification,
    title: "Easy verification",
    description: "Payment process is pretty simple and takes just a few steps.",
  },
  {
    icon: iconSupport,
    title: "Instant support",
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
