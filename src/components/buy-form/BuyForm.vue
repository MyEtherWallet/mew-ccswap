<template>
  <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8 mt-10">
    <SubmitForm :form-data="formData" :return-url="currentUrl" />
    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="mb-2 d-flex align-center">
        <div class="font-weight-bold">Crypto amount to buy</div>
        <div v-if="loadingCryptoAmount" class="ml-2">
          <span class="h4 font-weight-regular mr-1">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <div class="d-flex flex-wrap-reverse">
        <v-text-field
          hide-details
          type="number"
          v-model.number="cryptoAmount"
          :label="`Amount of ${cryptoSelected}`"
          required
          dense
          @keyup="debounce_getFiatForCrypto"
        ></v-text-field>
        <div
          :style="$vuetify.display.smAndDown ? 'width: 100%' : 'width: 130px'"
        >
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
      <div class="mb-2 d-flex align-center">
        <div class="font-weight-bold">Buying price</div>
        <div v-if="loadingFiatAmount" class="ml-2">
          <span class="h4 font-weight-regular mr-1">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <div class="d-flex flex-wrap-reverse">
        <v-text-field
          hide-details
          type="number"
          v-model.number="fiatAmount"
          :label="`Price in ${fiatSelected}`"
          :prefix="currencySymbol"
          required
          dense
          @keyup="debounce_getCryptoForFiat"
        ></v-text-field>
        <div
          :style="$vuetify.display.smAndDown ? 'width: 100%' : 'width: 130px'"
        >
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
        @keyup="verifyAddress"
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
    <div v-if="!processingBuyForm" class="pt-2 text-center">
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

      <div>
        <v-btn class="my-3" @click="resetForms" variant="text" size="small">
          Clear
        </v-btn>
      </div>

      <h4>You will be redirected to the partner's site</h4>
    </div>

    <div v-else class="text-center py-5">
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        color="#05c0a5"
      ></v-progress-circular>
      <div
        class="text-center font-weight-bold mt-3"
        style="line-height: 1.4rem"
      >
        Processing purchase....
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Buy limit warning -->
    <!-- ============================================================================= -->
    <v-snackbar v-model="showAlert" multi-line timeout="12000" color="black">
      <div class="text-center pa-3" style="max-width: 400px">
        <img
          class="mb-3"
          src="@/assets/images/bg-dog.svg"
          alt="MEW doggy"
          style="max-width: 100px"
        />
        <h3 class="text--white">
          Please type in right amount. Maximum daily crypto buy limit is between
          <span
            style="font-size: 1.2rem"
            class="text--white font-weight-bold text-decoration-underline"
          >
            US$50 and US$20,000
          </span>
        </h3>

        <v-btn class="mt-5" @click="showAlert = false" size="small">
          Close
        </v-btn>
      </div>
    </v-snackbar>

    <!-- ============================================================================= -->
    <!-- END of .component--buy-form -->
    <!-- ============================================================================= -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReCaptcha from '@/components/recaptcha/ReCaptcha.vue';
import {
  supportedCrypto,
  supportedFiat,
  currencySymbols,
  getSimplexQuote,
} from './prices.js';
import { executeSimplexPayment } from './order.js';
import _ from 'lodash';
import WAValidator from 'multicoin-address-validator';
import SubmitForm from './components/SubmitForm.vue';

const defaultFiatValue = 100;
const apiDebounceTime = 1000;

export default defineComponent({
  name: 'BuyForm',
  components: {
    ReCaptcha,
    SubmitForm,
  },
  data() {
    return {
      fiatAmount: defaultFiatValue,
      fiatSelected: 'USD',
      fiatItems: supportedFiat,

      cryptoAmount: null,
      cryptoSelected: 'ETH',
      cryptoItems: supportedCrypto,

      address: '',
      addressError: true,
      addressErrorMsg: '',

      loadingFiatAmount: false,
      loadingCryptoAmount: false,

      reCaptchaToken: null,

      showAlert: false,

      formData: null,

      processingBuyForm: false,
    };
  },
  watch: {
    // ============================================================================================
    // Watch for crypto currency change
    // ============================================================================================
    cryptoSelected() {
      this.verifyAddress();
      this.getCryptoForFiat();
    },

    // ============================================================================================
    // Watch for fiat currency change
    // ============================================================================================
    fiatSelected() {
      this.verifyAddress();
      this.getFiatForCrypto();
    },
  },
  computed: {
    currentUrl() {
      return window.location.href;
    },
    currencySymbol() {
      return currencySymbols[this.fiatSelected];
    },

    // ============================================================================================
    // Validate forms to Enable/Disable buy button
    // ============================================================================================
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
    // ============================================================================================
    // Set ReCaptcha token
    // ============================================================================================
    onReCaptchaToken(token) {
      this.reCaptchaToken = token;
    },

    // ============================================================================================
    // URL parameter
    // ============================================================================================
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

    // ============================================================================================
    // Get crypto amount for fiat amount from API
    // ============================================================================================
    async getCryptoForFiat(options = { isInitialLoading: false }) {
      // Turn on loading message
      this.loadingCryptoAmount = true;

      let response = null;

      try {
        response = await getSimplexQuote(
          this.fiatSelected,
          this.cryptoSelected,
          this.fiatSelected,
          this.fiatAmount
        );
      } catch (e) {
        // Turn off loading message
        this.loadingCryptoAmount = false;

        // Show alert message to the user
        this.showAlert = true;

        // ==============================================================================
        // Runs only on initial loading.
        // If URL parameter contains wrong fiat amount,
        // just reset fiat amount with defaultFiatValue to prevent more errors,
        // then pull the crypto value one more time.
        // ==============================================================================
        if (options.isInitialLoading) {
          this.resetForms();
          return;
        }

        // Restore valid(before error) fiat value
        this.getFiatForCrypto();
        return;
      }

      this.cryptoAmount = response.crypto_amount;

      // Turn off loading message
      this.loadingCryptoAmount = false;

      this.updateUrlParameters();
    },
    debounce_getCryptoForFiat: _.debounce(
      async function () {
        await this.getCryptoForFiat();
      },
      apiDebounceTime,
      { trailing: true }
    ),

    // ============================================================================================
    // Get fiat amount for crypto amount from API
    // ============================================================================================
    async getFiatForCrypto() {
      // Turn on loading message
      this.loadingFiatAmount = true;

      let response = null;

      try {
        response = await getSimplexQuote(
          this.fiatSelected,
          this.cryptoSelected,
          this.cryptoSelected,
          this.cryptoAmount
        );
      } catch (e) {
        // Turn off loading message
        this.loadingFiatAmount = false;

        this.showAlert = true;

        // Restore valid(before error) crypto value
        this.getCryptoForFiat();
        return;
      }

      this.fiatAmount = response.fiat_amount;

      // Turn off loading message
      this.loadingFiatAmount = false;

      this.updateUrlParameters();
    },
    debounce_getFiatForCrypto: _.debounce(
      async function () {
        await this.getFiatForCrypto();
      },
      apiDebounceTime,
      { trailing: true }
    ),

    // ============================================================================================
    // Verify crypto address
    // ============================================================================================
    verifyAddress() {
      const valid = WAValidator.validate(this.address, this.cryptoSelected);
      if (!valid) {
        if (this.address == '') {
          this.addressErrorMsg = ``;
        } else {
          //this.addressErrorMsg = `Please type in a valid ${this.cryptoSelected} address`;
          this.addressErrorMsg = `Please type in a valid ETH address`;
        }

        this.addressError = true;
      } else {
        this.addressErrorMsg = '';
        this.addressError = false;
        this.updateUrlParameters();
      }
    },

    // ============================================================================================
    // Reset all forms
    // ============================================================================================
    resetForms() {
      this.fiatAmount = defaultFiatValue;
      this.fiatSelected = 'USD';
      this.cryptoAmount = null;
      this.cryptoSelected = 'ETH';
      this.address = '';
      this.debounce_getCryptoForFiat();
    },

    // ============================================================================================
    // Buy button click
    // ============================================================================================
    async buy() {
      this.processingBuyForm = true;

      const response = await executeSimplexPayment(
        this.fiatSelected,
        this.cryptoSelected,
        this.fiatSelected,
        this.fiatAmount,
        this.address
      );

      this.formData = response;

      this.processingBuyForm = false;
    },
  },
  async mounted() {
    // Load URL parameter value and verify crypto address
    this.loadUrlParameters();
    this.verifyAddress();

    // Get crypto amount based on current fiat amount
    this.getCryptoForFiat({ isInitialLoading: true });
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
