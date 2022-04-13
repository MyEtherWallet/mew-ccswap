<template>
  <div
    class="component--promo"
    :style="
      $vuetify.display.lgAndUp ? 'padding-top: 150px' : 'padding-top: 100px'
    "
  >
    <div>
      <h1 class="mb-9">
        We have increased maximum buy limits for hassle free transactions
      </h1>
      <v-row>
        <v-col cols="12" md="4" v-for="(p1, key1) in promo1" :key="key1">
          <div class="elevated-box-small pa-6">
            <h2 class="font-weight-light mb-2">{{ p1.title }}</h2>
            <div class="font-weight-light">
              {{ p1.description }}
            </div>
            <h2 class="text-mew font-weight-medium mt-3">
              {{ p1.amount }}
              <span>{{ p1.rate }}</span>
            </h2>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      :style="
        $vuetify.display.mdAndUp ? 'margin-top: 200px' : 'margin-top: 100px'
      "
    >
      <h1 class="mb-9">
        That is the reason why millions of our users choose us
      </h1>
      <v-row>
        <v-col cols="12" md="6" v-for="(p2, key2) in promo2" :key="key2">
          <div class="d-flex align-center pb-8">
            <img class="mr-4" :src="p2.icon" alt="Promo" />
            <div>
              <h2 class="font-weight-light mb-2">{{ p2.title }}</h2>
              <div
                class="font-weight-light"
                v-if="p2.description"
                style="max-width: 400px"
              >
                {{ p2.description }}
              </div>
              <div
                class="font-weight-light"
                v-else="p2.description"
                style="max-width: 400px"
              >
                Feel free to contact
                <a href="mailto:support@simplex.com">support@simplex.com</a>
                should you have questions
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import iconFee from '@/assets/images/promo/icon-fee.png';
import iconQuick from '@/assets/images/promo/icon-quick.png';
import iconVerification from '@/assets/images/promo/icon-verification.png';
import iconSupport from '@/assets/images/promo/icon-support.png';

export default defineComponent({
  name: 'Promo',
  components: {},
  data() {
    return {
      promo1: [
        {
          title: 'First time buy limit',
          description:
            'If you are buying coins very first time, you can buy up to $10,000 worth of coins.',
          amount: '$50~$10,000',
          rate: 'for first buy',
        },
        {
          title: 'Daily buy limit',
          description: 'You can buy up to $20,000 worth of coins daily.',
          amount: 'Max $20,000',
          rate: '/day',
        },
        {
          title: 'Monthly buy limit',
          description: 'You can buy up to $50,000 worth of coins monthly.',
          amount: 'Max $50,000',
          rate: '/month',
        },
      ],
      promo2: [
        {
          icon: iconFee,
          title: 'Reasonable fee',
          description:
            'Extra charges apply in addition to the rate provided, including a 1% MyEtherWallet fee.',
        },
        {
          icon: iconQuick,
          title: 'Quick transactions',
          description:
            'We offer lightning-fast transactions typically taking just minutes.',
        },
        {
          icon: iconVerification,
          title: 'Easy verification',
          description:
            'Payment process is pretty simple and takes just a few steps.',
        },
        {
          icon: iconSupport,
          title: 'Instant support',
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped>
.component--promo {
  padding-bottom: 200px;
}

h1 {
  max-width: 600px;
}
</style>
