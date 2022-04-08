<template>
  <div class="component--buy-form elevated-box pa-2">
    <v-container>
      <v-row>
        <v-col>
          <div class="mb-2 font-weight-bold">Purchasing price</div>
          <div class="d-flex">
            <v-text-field
              v-model.number="fiatAmount"
              label="Price in USD"
              required
              dense
              hide-details
            ></v-text-field>

            <div style="width: 110px">
              <v-select
                v-model="fiatCurrencySelected"
                label="Currency"
                :items="fiatCurrencyItems"
              ></v-select>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="mb-2 font-weight-bold">Coin amount</div>
          <div class="d-flex">
            <v-text-field
              v-model.number="cryptoAmount"
              label="Amount of ETH"
              required
              dense
              hide-details
            ></v-text-field>

            <div style="width: 110px">
              <v-select
                v-model="cryptoCurrencySelected"
                label="Currency"
                :items="cryptoCurrencyItems"
              ></v-select>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="d-flex align-center mb-2">
            <div class="font-weight-bold">Address to receive coin</div>
            <a
              class="small ml-2"
              href="https://www.myetherwallet.com/wallet/create"
              target="_blank"
            >
              Don't have a wallet?
            </a>
          </div>
          <v-text-field
            v-model.number="address"
            label="ETH address"
            required
            dense
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn min-height="50px" min-width="200px" color="#05C0A5">
            <div class="text-white">Buy</div>
          </v-btn>

          <h4 class="mt-4">You will be redirected to the partner's site</h4>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BuyForm',
  data() {
    return {
      fiatAmount: 1873,
      fiatCurrencySelected: 'USD',
      fiatCurrencyItems: ['USD', 'EUR'],
      cryptoAmount: 1,
      cryptoCurrencySelected: 'ETH',
      cryptoCurrencyItems: ['ETH', 'BTC'],
      address: '0x3cd751e6b0078be393132286c442345e5dc49699',
    };
  },
});
</script>

<style lang="scss">
// Fix v-select(currency select) height issue
.component--buy-form {
  .v-select .v-field .v-field__input > input {
    height: 0;
    width: 0;
  }
}
</style>
