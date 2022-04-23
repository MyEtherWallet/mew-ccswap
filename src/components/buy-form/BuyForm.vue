<template>
  <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8 mt-10">
    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="mb-2 font-weight-bold">Crypto amount to buy</div>
      <div class="d-flex flex-wrap-reverse">
        <v-text-field
          hide-details
          type="number"
          v-model.number="cryptoAmount"
          :label="`Amount of ${cryptoSelected}`"
          required
          dense
          @keyup="debounce_getFiatForCrypto()"
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

    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="mb-2 font-weight-bold">Buying price</div>
      <div class="d-flex flex-wrap-reverse">
        <v-text-field
          readonly
          hide-details
          type="number"
          v-model.number="fiatAmount"
          :label="`Price in ${fiatSelected}`"
          :prefix="currencySymbol"
          required
          dense
        ></v-text-field>
        <!--
        <v-text-field
          readonly
          hide-details
          type="number"
          v-model.number="fiatAmount"
          :label="`Price in ${fiatSelected}`"
          :prefix="currencySymbol"
          required
          dense
          @keyup="getCryptoForFiat($event)"
        ></v-text-field>
        -->
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

    <!-- ============================================================================= -->
    <!-- Wallet address -->
    <!-- ============================================================================= -->
    <div>
      <div class="d-sm-flex align-center mb-2">
        <div class="font-weight-bold mr-2">
          Wallet address to receive crypto
        </div>
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

    <!-- ============================================================================= -->
    <!-- Google ReCaptcha v3 -->
    <!-- ============================================================================= -->
    <div class="d-flex align-center justify-center mt-3 mb-5">
      <ReCaptcha @token="onReCaptchaToken" />
    </div>

    <!-- ============================================================================= -->
    <!-- Buy/Rest button -->
    <!-- ============================================================================= -->
    <div class="pt-2 text-center">
      <div>
        <v-btn
          :disabled="!areFormsValid"
          min-height="50px"
          min-width="200px"
          color="#05C0A5"
          @click="buy"
        >
          <div class="text--white">Buy</div>
        </v-btn>
      </div>
      <div class="mt-2">
        <v-btn @click="clearForms" elevation="0">
          <h5 class="font-weight-regular">Clear</h5>
        </v-btn>
      </div>
      <h4 class="mt-2">You will be redirected to the partner's site</h4>
    </div>

    <!-- ============================================================================= -->
    <!-- END of .component--buy-form -->
    <!-- ============================================================================= -->
  </div>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { defineComponent } from 'vue';
import ReCaptcha from '@/components/recaptcha/ReCaptcha.vue';
import {
  supportedCrypto,
  supportedFiat,
  currencySymbols,
  getFiatPrice,
  getSimplexFiatPrice,
} from './prices.js';
import { executeOrder } from './order.js';
import _ from 'lodash';
import WAValidator from 'multicoin-address-validator';

export default defineComponent({
  name: 'BuyForm',
  components: {
    ReCaptcha,
  },
  data() {
    return {
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
    /* ============================================================================================ */
    /* Watch for crypto currency change */
    /* ============================================================================================ */
    cryptoSelected() {
      // Clear address @ change crypto
      //this.address = '';
      this.verifyAddress();
      this.setFiatPricePerCrypto();
      this.getFiatForCrypto();
    },

    /* ============================================================================================ */
    /* Watch for fiat currency change */
    /* ============================================================================================ */
    fiatSelected() {
      this.verifyAddress();
      this.setFiatPricePerCrypto();
      this.getFiatForCrypto();
    },
  },
  computed: {
    currencySymbol() {
      return currencySymbols[this.fiatSelected];
    },

    /* ============================================================================================ */
    /* Validate forms to Enable/Disable buy button */
    /* ============================================================================================ */
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
    /* ============================================================================================ */
    /* Set ReCaptcha token */
    /* ============================================================================================ */
    onReCaptchaToken(token) {
      this.reCaptchaToken = token;
    },

    /* ============================================================================================ */
    /* URL parameter */
    /* ============================================================================================ */
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
    loadUrlParameters() {
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

    /* ============================================================================================ */
    /* Set fiat price per crypto value */
    /* ============================================================================================ */
    async setFiatPricePerCrypto() {
      this.fiatPricePerCrypto = await getSimplexFiatPrice(
        this.fiatSelected,
        this.cryptoSelected,
        1
      );
    },

    /* ============================================================================================ */
    /* Get crypto value from API */
    /* ============================================================================================ */
    async getFiatForCrypto() {
      //console.log(`[BuyForm.vue] Getting quote from API...`);

      this.fiatAmount = await getSimplexFiatPrice(
        this.fiatSelected,
        this.cryptoSelected,
        _.toNumber(this.cryptoAmount)
      );

      this.updateUrlParameters();
    },
    debounce_getFiatForCrypto: _.debounce(
      async function () {
        await this.getFiatForCrypto();
      },
      1300,
      { trailing: true }
    ),
    async getCryptoForFiat(e) {
      const fiatAmount = e.target.value;

      // Set estimated crypto amount for the fiat amount
      this.cryptoAmount = BigNumber(fiatAmount)
        .div(this.fiatPricePerCrypto)
        .toNumber();

      // Get real fiat amount for the estimated crypto amount from API
      await this.debounce_getFiatForCrypto();

      this.updateUrlParameters();
    },

    /* ============================================================================================ */
    /* Verify crypto address */
    /* ============================================================================================ */
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

    /* ============================================================================================ */
    /* Clear all forms */
    /* ============================================================================================ */
    clearForms() {
      this.fiatAmount = 1;
      this.fiatSelected = 'USD';
      this.cryptoAmount = 1;
      this.cryptoSelected = 'ETH';
      this.address = '';
      this.debounce_getFiatForCrypto();
    },

    /* ============================================================================================ */
    /* Buy button click */
    /* ============================================================================================ */
    async buy() {
      await executeOrder(
        this.address,
        this.fiatSelected,
        this.cryptoSelected,
        this.cryptoAmount
      );
    },
  },
  async mounted() {
    // Load URL parameter value and verify crypto address
    this.loadUrlParameters();
    this.verifyAddress();

    // Set fiat price per crypto for local price estimation
    await this.setFiatPricePerCrypto();

    // Get fiat value based on current crypto amount
    this.getFiatForCrypto();
  },
});
</script>

<style lang="scss">
.component--buy-form {
  // Fix v-select(currency select) height issue
  .v-select .v-field .v-field__input > input {
    height: 0;
    width: 0;
  }

  // Adjust (text field) prefix font size
  .v-messages__message {
    font-weight: 300;
    font-size: 0.9rem;
  }
  .v-text-field__prefix {
    font-size: 0.8rem;
  }
}
</style>
