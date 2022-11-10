<template>
  <div
    class="component--promo"
    :style="$vuetify.display.lgAndUp ? 'padding: 150px 0' : 'padding: 100px 0'"
  >
    <div>
      <v-container>
        <h1 class="mb-9" style="color: white">
          We have increased maximum buy limits for hassle free transactions
        </h1>
        <v-row>
          <v-col cols="12" md="4" v-for="(p1, key1) in promo1" :key="key1">
            <div class="elevated-box-small pa-10">
              <div class="heading-2 text-purple mb-2">
                {{ p1.amount }}
              </div>
              <h2 class="font-weight-medium text-gray">{{ p1.title }}</h2>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
const promo1 = [
  {
    title: 'For your first transaction',
    description:
      'If you are buying coins very first time, you can buy up to $20,000 worth of coins.',
    amount: '$50 to $20,000',
    rate: 'for first buy',
  },
  {
    title: 'Daily limit',
    description: 'You can buy up to $20,000 worth of coins daily.',
    amount: 'Up to $20,000',
    rate: '/day',
  },
  {
    title: 'Monthly limit',
    description: 'You can buy up to $50,000 worth of coins monthly.',
    amount: 'Up to $50,000',
    rate: '/month',
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

.elevated-box-small {
  box-shadow: 0 8px 10px rgb(0 0 0 / 15%);
  border-radius: 5px 5px 10px 10px;
  background-color: white;
  // border-top: 10px solid $purple;
}
</style>
