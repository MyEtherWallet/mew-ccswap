<template>
  <div class="component--buy-form elevated-box pa-6 mt-10">
    <v-container>
      <v-row>
        <v-col>
          <div class="mb-2 font-weight-bold">Coin amount to buy</div>
          <div class="d-flex">
            <v-text-field
              v-model.number="cryptoAmount"
              label="Amount of ETH"
              required
              dense
              hide-details
              @keydown="updateUrlParameters"
            ></v-text-field>

            <div style="width: 110px">
              <v-select
                v-model="cryptoCurrencySelected"
                label="Currency"
                :items="cryptoCurrencyItems"
                @blur="updateUrlParameters"
              ></v-select>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="mb-2 font-weight-bold">Purchasing price</div>
          <div class="d-flex">
            <v-text-field
              v-model.number="fiatAmount"
              label="Price in USD"
              prefix="$"
              required
              dense
              hide-details
              @keydown="updateUrlParameters"
            ></v-text-field>

            <div style="width: 110px">
              <v-select
                v-model="fiatCurrencySelected"
                label="Currency"
                :items="fiatCurrencyItems"
                @blur="updateUrlParameters"
              ></v-select>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="d-sm-flex align-center mb-2">
            <div class="font-weight-bold mr-2">Address to receive coin</div>
            <a
              class="small"
              href="https://www.myetherwallet.com/wallet/create"
              target="_blank"
            >
              Don't have a wallet?
            </a>
          </div>
          <v-text-field
            v-model="address"
            label="ETH address"
            required
            dense
            hide-details
            @keydown="updateUrlParameters"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <div class="pt-10">
            <v-btn min-height="50px" min-width="200px" color="#05C0A5">
              <div class="text-white">Buy</div>
            </v-btn>
            <h4 class="mt-4">You will be redirected to the partner's site</h4>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReCaptcha from '@/components/recaptcha/ReCaptcha.vue';

export default defineComponent({
  name: 'BuyForm',
  components: {
    ReCaptcha,
  },
  data() {
    return {
      fiatAmount: 0,
      fiatCurrencySelected: 'USD',
      fiatCurrencyItems: ['USD', 'EUR'],
      cryptoAmount: 0,
      cryptoCurrencySelected: 'ETH',
      cryptoCurrencyItems: ['ETH', 'BTC'],
      address: '',
    };
  },
  watch: {},
  methods: {
    updateUrlParameters() {
      let urlParameters = '?';
      urlParameters += `fiat=${this.fiatCurrencySelected}&`;
      urlParameters += `fiat_amount=${this.fiatAmount}&`;
      urlParameters += `crypto=${this.cryptoCurrencySelected}&`;
      urlParameters += `crypto_amount=${this.cryptoAmount}&`;
      urlParameters += `to=${this.address}`;

      if (history.pushState) {
        const newurl =
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          urlParameters;
        window.history.pushState({ path: newurl }, '', newurl);
      }
    },
    useUrlParameters() {
      const queryString = window.location.search;
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        this.fiatCurrencySelected = urlParams.get('fiat');
        this.fiatAmount = urlParams.get('fiat_amount');
        this.cryptoCurrencySelected = urlParams.get('crypto');
        this.cryptoAmount = urlParams.get('crypto_amount');
        this.address = urlParams.get('to');
      }
    },
  },
  mounted() {
    this.useUrlParameters();
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
