<template>
  <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8 mt-10">
    <div class="mb-10">
      <div class="mb-2 font-weight-bold">Coin amount to buy</div>
      <div class="d-flex flex-wrap-reverse">
        <v-text-field
          hide-details
          type="number"
          v-model.number="cryptoAmount"
          :label="`Amount of ${cryptoSelected}`"
          required
          dense
          @keyup="getFiatAmount()"
        ></v-text-field>

        <div style="width: 130px">
          <v-select
            hide-details
            v-model="cryptoSelected"
            label="Currency"
            :items="cryptoItems"
          ></v-select>
        </div>
      </div>
    </div>

    <div class="mb-10">
      <div class="mb-2 font-weight-bold">Buying price</div>
      <div class="d-flex flex-wrap-reverse">
        <v-text-field
          hide-details
          type="number"
          v-model.number="fiatAmount"
          :label="`Price in ${fiatSelected}`"
          prefix="$"
          required
          dense
          @keyup="getCryptoAmount($event)"
        ></v-text-field>

        <div style="width: 130px">
          <v-select
            hide-details
            v-model="fiatSelected"
            label="Currency"
            :items="fiatItems"
          ></v-select>
        </div>
      </div>
    </div>

    <div>
      <div class="d-sm-flex align-center mb-2">
        <div class="font-weight-bold mr-2">Address to receive crypto</div>
        <a
          class="small d-block mt-n1 mt-sm-0"
          href="https://www.myetherwallet.com/wallet/create"
          target="_blank"
        >
          Need Ethereum wallet?
        </a>
      </div>

      <v-text-field
        v-model="address"
        :label="`${cryptoSelected} address`"
        required
        dense
        :error-messages="addressErrorMsg"
        @keyup="verifyAddress($event)"
      ></v-text-field>
    </div>

    <div class="d-flex align-center justify-center mt-3 mb-5">
      <ReCaptcha @token="onReCaptchaToken" />
    </div>

    <div class="pt-2 text-center">
      <div>
        <v-btn
          :disabled="!areFormsValid"
          min-height="50px"
          min-width="200px"
          color="#05C0A5"
        >
          <div class="text-white">Buy</div>
        </v-btn>
      </div>
      <div class="mt-2">
        <v-btn @click="clearForms" elevation="0">
          <h4 class="font-weight-regular">Clear</h4>
        </v-btn>
      </div>
      <h4 class="mt-2">You will be redirected to the partner's site</h4>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReCaptcha from '@/components/recaptcha/ReCaptcha.vue';
import { supportedCrypto, supportedFiat, getFiatPrice } from './prices.js';
import _ from 'lodash';
import WAValidator from 'multicoin-address-validator';

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
      addressError: true,
      addressErrorMsg: '',
      reCaptchaToken: null,
    };
  },
  watch: {
    fiatSelected() {
      this.verifyAddress();
      this.getFiatAmount(true);
    },
    cryptoSelected() {
      this.address = '';
      this.verifyAddress();
      this.getFiatAmount(true);
    },
  },
  computed: {
    areFormsValid() {
      return (
        this.fiatAmount > 0 &&
        this.cryptoAmount > 0 &&
        this.fiatSelected != '' &&
        this.cryptoSelected != '' &&
        this.addressError != true &&
        this.reCaptchaToken != ''
      );
    },
  },
  methods: {
    onReCaptchaToken(token) {
      this.reCaptchaToken = token;
    },
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

        this.fiatSelected = urlParams.get('fiat')
          ? urlParams.get('fiat')
          : 'USD';

        this.fiatAmount = urlParams.get('fiat_amount');

        this.cryptoSelected = urlParams.get('crypto')
          ? urlParams.get('crypto')
          : 'ETH';

        const cryptoAmount = urlParams.get('crypto_amount');
        if (_.toNumber(cryptoAmount)) {
          this.cryptoAmount = cryptoAmount;
        } else {
          this.cryptoAmount = 1;
        }

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
      500,
      { trailing: false }
    ),
    async getFiatAmount(loadOnlineApiData = false) {
      // Fetch API data only when it is necessary
      if (loadOnlineApiData) {
        await this.throttle_getFiatPrice();
      }

      this.fiatAmount = this.fiatPricePerCrypto * this.cryptoAmount;
      this.updateUrlParameters();
    },
    getCryptoAmount(e) {
      const fiatAmount = parseFloat(e.target.value);
      const fiatPricePerCrypto = parseFloat(this.fiatPricePerCrypto);
      this.cryptoAmount = fiatAmount / fiatPricePerCrypto;
      this.updateUrlParameters();
    },
    verifyAddress(e = null) {
      let address = '';
      if (e) {
        address = e.target.value;
      } else {
        address = this.address;
      }

      const valid = WAValidator.validate(address, this.cryptoSelected);
      if (!valid) {
        if (this.address == '') {
          this.addressErrorMsg = ``;
        } else {
          this.addressErrorMsg = `Please type in a valid ${this.cryptoSelected} address`;
        }

        this.addressError = true;
      } else {
        this.addressErrorMsg = '';
        this.addressError = false;
        this.updateUrlParameters();
      }
    },
    clearForms() {
      this.fiatAmount = 1;
      this.fiatSelected = 'USD';
      this.cryptoAmount = 1;
      this.cryptoSelected = 'ETH';
      this.address = '';
      this.getFiatAmount();
    },
  },
  mounted() {
    this.useUrlParametersOnLoad();
    this.getFiatAmount(true);
    this.verifyAddress();
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

  .v-messages__message {
    font-weight: 300;
    font-size: 0.9rem;
  }
}
</style>
