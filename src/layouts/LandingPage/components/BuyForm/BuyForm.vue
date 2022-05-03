<template>
  <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8">
    <SubmitForm class="mb-15" :form-data="formData" :return-url="currentUrl" />

    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="d-flex align-center">
        <div class="heading-4 text-uppercase">Price</div>
        <div v-if="loadingFiatAmount" class="ml-2">
          <span class="h3 font-weight-regular mr-1 text--mew">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <!--
      <h4>
        ** Daily buy limit:
        <span class="font-weight-medium">USD $50 ~ $20,000</span>
      </h4>
      -->
      <div class="d-flex mt-2">
        <v-text-field
          hide-details
          type="number"
          v-model.number="fiatAmount"
          required
          dense
          @update:modelValue="debounce_getCryptoForFiat"
        ></v-text-field>
        <v-select
          style="max-width: 100px"
          hide-details
          v-model="fiatSelected"
          :items="fiatItems"
        ></v-select>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="d-flex align-center">
        <div class="heading-4 text-uppercase">Amount</div>
        <div v-if="loadingCryptoAmount" class="ml-2">
          <span class="h3 font-weight-regular mr-1 text--mew">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <!--
      <h4>
        ** Daily buy limit:
        <span class="font-weight-medium">USD $50 ~ $20,000</span>
      </h4>
      -->
      <div class="d-flex mt-2">
        <v-text-field
          hide-details
          type="number"
          v-model.number="cryptoAmount"
          required
          dense
          @update:modelValue="debounce_getFiatForCrypto"
        ></v-text-field>
        <v-select
          style="max-width: 100px"
          hide-details
          v-model="cryptoSelected"
          :items="cryptoItems"
        ></v-select>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Wallet address -->
    <!-- ============================================================================= -->
    <div>
      <div class="d-sm-flex align-center justify-space-between mb-2">
        <div class="heading-4 text-uppercase mr-2">ETH Address</div>
        <a
          class="small d-block mt-n1 mt-sm-0"
          href="https://www.myetherwallet.com/wallet/create"
          target="_blank"
        >
          Don't have one?
        </a>
      </div>
      <v-text-field
        v-model="address"
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
          rounded="pill"
          :disabled="!areFormsValid"
          min-height="60px"
          min-width="200px"
          color="#05C0A5"
          @click="buy"
        >
          <div class="text--white">Continue</div>
        </v-btn>
      </div>

      <!--
      <div>
        <v-btn class="my-3" @click="resetForms" variant="text" size="small">
          Clear
        </v-btn>
      </div>
      -->

      <div class="text--secondary mt-6">
        You will be redirected to the partner's site
      </div>
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
    <v-snackbar v-model="showAlert" multi-line timeout="12000">
      <div class="text-center pa-3" style="max-width: 350px">
        <img
          src="@/assets/images/icon-mew-wallet.png"
          alt="MEW doggy"
          style="max-width: 80px"
        />
        <h3 class="text--white">
          Uh oh... Maximum daily crypto buy limit is between
          <span style="font-size: 1.2rem" class="text--white font-weight-bold">
            USD $50 ~ $20,000
          </span>
        </h3>

        <v-btn class="mt-3" @click="showAlert = false" size="small">
          Close
        </v-btn>
      </div>
    </v-snackbar>

    <!-- ============================================================================= -->
    <!-- END -->
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
  getSimplexQuote
} from './prices.js';
import { executeSimplexPayment } from './order.js';
import _ from 'lodash';
import WAValidator from 'multicoin-address-validator';
import SubmitForm from './SubmitForm.vue';

const defaultFiatValue = 100;
const apiDebounceTime = 1000;

export default defineComponent({
  name: 'BuyForm',
  components: {
    ReCaptcha,
    SubmitForm
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

      processingBuyForm: false
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
    }
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
    }
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
        this.fiatAmount = urlParams.get('fiat_amount');
        const cryptoAmount = urlParams.get('crypto_amount');
        if (_.isNumber(cryptoAmount)) {
          this.cryptoAmount = cryptoAmount;
        } else {
          this.cryptoAmount = 1;
        }

        this.address = urlParams.get('to');
        this.fiatSelected = urlParams.get('fiat')
          ? urlParams.get('fiat').toUpperCase()
          : 'USD';

        this.cryptoSelected = urlParams.get('crypto')
          ? urlParams.get('crypto').toUpperCase()
          : 'ETH';
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

      // this.updateUrlParameters();
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

      // this.updateUrlParameters();
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
        // this.updateUrlParameters();
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

      // Manual form submission for development only
      this.formData = response;
    }
  },
  async mounted() {
    // Load URL parameter value and verify crypto address
    this.loadUrlParameters();
    this.verifyAddress();

    // Get crypto amount based on current fiat amount
    this.getCryptoForFiat({ isInitialLoading: true });
  }
});
</script>

<style lang="scss">
.component--buy-form {
  // Fix v-select(currency select) height issue
  .v-select .v-field .v-field__input > input {
    height: 0;
    width: 0;
  }

  .v-field--appended {
    background-color: black;
    .v-select__selection-text {
      color: white;
    }

    .v-field__append-inner {
      .v-icon {
        opacity: 1;
        &::before {
          color: white;
        }
      }
    }
  }

  .v-field__field {
    padding: 0;
  }

  .v-field__input {
    padding-top: 0;
  }

  .v-select__selection-text {
    display: flex;
    align-items: center;
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
