<template>
  <div class="component--buy-form elevated-box pa-6 mt-10">
    <v-container>
      <v-row>
        <v-col cols="12" lg="6">
          <div class="mb-2 font-weight-bold">Coin amount to buy</div>
          <div class="d-flex">
            <v-text-field
              v-model.number="cryptoAmount"
              :label="`Amount of ${cryptoSelected}`"
              required
              dense
              hide-details
            ></v-text-field>

            <div style="width: 110px">
              <v-select
                v-model="cryptoSelected"
                label="Currency"
                :items="cryptoItems"
              ></v-select>
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="mb-2 font-weight-bold">Purchasing price</div>
          <div class="d-flex">
            <v-text-field
              v-model.number="fiatAmount"
              :label="`Price in ${fiatSelected}`"
              prefix="$"
              required
              dense
              hide-details
            ></v-text-field>

            <div style="width: 110px">
              <v-select
                v-model="fiatSelected"
                label="Currency"
                :items="fiatItems"
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
              class="small d-block mt-n1 mt-sm-0"
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
import { supportedCrypto, supportedFiat, getFiatPrice } from './prices.js';
import _ from 'lodash';

export default defineComponent({
  name: 'BuyForm',
  components: {
    ReCaptcha,
  },
  data() {
    return {
      provider: 'simplex',
      fiatAmount: 1,
      fiatSelected: 'USD',
      fiatItems: supportedFiat,
      cryptoAmount: 1,
      cryptoSelected: 'ETH',
      cryptoItems: supportedCrypto,
      address: '',
      fiatPricePerCrypto: null,
    };
  },
  watch: {
    fiatAmount() {
      this.getPrice();
    },
    fiatSelected() {
      this.getPrice();
    },
    cryptoAmount() {
      this.getPrice();
    },
    cryptoSelected() {
      this.getPrice();
    },
  },
  methods: {
    updateUrlParameters() {
      let urlParameters = '?';
      urlParameters += `fiat=${this.fiatSelected}&`;
      urlParameters += `fiat_amount=${this.fiatAmount}&`;
      urlParameters += `crypto=${this.cryptoSelected}&`;
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
    useUrlParametersOnLoad() {
      const queryString = window.location.search;

      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        this.fiatSelected = urlParams.get('fiat');
        this.fiatAmount = urlParams.get('fiat_amount');
        this.cryptoSelected = urlParams.get('crypto');
        this.cryptoAmount = urlParams.get('crypto_amount');
        this.address = urlParams.get('to');
      }
    },
    throttle_getFiatPrice: _.throttle(
      async function () {
        this.fiatPricePerCrypto = await getFiatPrice(
          this.provider,
          this.cryptoSelected,
          this.fiatSelected
        );
      },
      1500,
      { trailing: false }
    ),
    async getPrice() {
      await this.throttle_getFiatPrice();

      /*
      const fiatPricePerCrypto = await getFiatPrice(
        this.provider,
        this.cryptoSelected,
        this.fiatSelected
      );
      */
      this.fiatAmount = this.fiatPricePerCrypto * this.cryptoAmount;
      this.updateUrlParameters();
    },
  },
  mounted() {
    this.useUrlParametersOnLoad();
    this.getPrice();
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
