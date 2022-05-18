<template>
  <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8">
    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="d-flex align-center">
        <div class="heading-4 text-uppercase">Price</div>
        <div v-if="loading.fiatAmount" class="ml-2">
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
          type="number"
          v-model.number="form.fiatAmount"
          required
          dense
          @update:modelValue="debounce_getCryptoForFiat"
        ></v-text-field>
        <v-select
          style="max-width: 100px"
          v-model="form.fiatSelected"
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
        <div v-if="loading.cryptoAmount" class="ml-2">
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
          type="number"
          v-model.number="form.cryptoAmount"
          required
          dense
          @update:modelValue="debounce_getFiatForCrypto"
        ></v-text-field>
        <v-select
          style="max-width: 100px"
          v-model="form.cryptoSelected"
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
        v-model="form.address"
        required
        dense
        :error-messages="form.addressErrorMsg"
        @keyup="verifyAddress"
      ></v-text-field>
    </div>

    <!-- ============================================================================= -->
    <!-- Google ReCaptcha v3 -->
    <!-- ============================================================================= -->
    <!-- <div class="d-flex align-center justify-center mt-3 mb-5">
      <ReCaptcha @token="onReCaptchaToken" />
    </div> -->

    <!-- ============================================================================= -->
    <!-- Buy/Rest button -->
    <!-- ============================================================================= -->
    <div v-if="!processingBuyForm" class="pt-2 text-center">
      <div>
        <v-btn
          rounded="pill"
          :disabled="!isValidForm"
          min-height="60px"
          min-width="200px"
          color="#05C0A5"
          @click="submitForm"
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
    <v-snackbar v-model="loading.showAlert" multi-line timeout="5000">
      <div class="text-center pa-3" style="max-width: 350px">
        <img :src="mewWalletImg" alt="MEW doggy" style="max-width: 80px" />
        <h3 class="text--white">
          Uh oh... Maximum daily crypto buy limit is between
          <span style="font-size: 1.2rem" class="text--white font-weight-bold">
            USD $50 ~ $20,000
          </span>
        </h3>

        <v-btn class="mt-3" @click="loading.showAlert = false" size="small">
          Close
        </v-btn>
      </div>
    </v-snackbar>

    <!-- ============================================================================= -->
    <!-- END -->
    <!-- ============================================================================= -->
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, reactive, watch } from "vue";
import BigNumber from "bignumber.js";
// import ReCaptcha from "@/components/recaptcha/ReCaptcha.vue";
import { supportedCrypto, supportedFiat, getSimplexQuote } from "./prices";
import { executeSimplexPayment } from "./order";
import { debounce } from "lodash";
import WAValidator from "multicoin-address-validator";
import mewWallet from "@/assets/images/icon-mew-wallet.png";
// import SubmitForm from "./SubmitForm.vue";

const mewWalletImg = mewWallet;
const defaultFiatValue = "100";
const apiDebounceTime = 1000;

defineComponent({
  name: "BuyForm",
  setup() {
    // Load URL parameter value and verify crypto address
    loadUrlParameters();
    verifyAddress();

    // Get crypto amount based on current fiat amount
    getCryptoForFiat(true);
  },
});

// data

// non-reactive
const fiatItems: string[] = supportedFiat;
const cryptoItems: string[] = supportedCrypto;

// reactive
const form = reactive({
  fiatAmount: defaultFiatValue,
  fiatSelected: "USD",
  cryptoAmount: "0",
  cryptoSelected: "ETH",
  address: "",
  addressErrorMsg: "",
  reCaptchaToken: "",
  addressError: false,
});

const loading = reactive({
  fiatAmount: false,
  cryptoAmount: false,
  showAlert: false,
  processingBuyForm: false,
});

// const formData = ref(null);

// watchers
watch([form.cryptoSelected, form.fiatSelected], () => {
  verifyAddress();
  getCryptoForFiat(false);
});

const isValidForm = computed(() => {
  const fiatBn = new BigNumber(form.fiatAmount);
  const cryptoBn = new BigNumber(form.cryptoAmount);
  return (
    fiatBn.gt(0) &&
    cryptoBn.gt(0) &&
    form.fiatSelected &&
    form.cryptoSelected &&
    !form.addressError &&
    form.reCaptchaToken
  );
});

// methods
const loadUrlParameters = () => {
  const queryString = window.location.search;

  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const queryCryptoAmount = urlParams.get("crypto_amount");
    const queryFiat = urlParams.get("fiat");
    const queryCrypto = urlParams.get("crypto");
    const queryTo = urlParams.get("to");
    form.fiatSelected = queryFiat ? queryFiat : "USD";
    form.fiatAmount = queryCryptoAmount ? queryCryptoAmount : "100";
    form.cryptoSelected = queryCrypto ? queryCrypto : "ETH";
    form.cryptoAmount = queryCryptoAmount ? queryCryptoAmount : "1";
    form.address = queryTo ? queryTo : "";
  }
};
// const onReCaptchaToken = (token: string): void => {
//   form.reCaptchaToken = token;
// };

const getCryptoForFiat = async (isLoading: boolean): Promise<void> => {
  loading.cryptoAmount = true;
  try {
    const response = await getSimplexQuote(
      form.fiatSelected,
      form.cryptoSelected,
      form.cryptoSelected,
      form.fiatAmount
    );
    form.cryptoAmount = response.crypto_amount;
    loading.cryptoAmount = false;
  } catch (e) {
    loading.cryptoAmount = false;
    loading.showAlert = true;

    if (isLoading) {
      return resetForm();
    }

    return getFiatForCrypto();
  }
};

const getFiatForCrypto = async (): Promise<void> => {
  loading.fiatAmount = true;
  try {
    const response = await getSimplexQuote(
      form.fiatSelected,
      form.cryptoSelected,
      form.cryptoSelected,
      form.cryptoAmount
    );
    form.fiatAmount = response.fiat_amount;
    loading.fiatAmount = false;
  } catch (e) {
    loading.fiatAmount = false;
    loading.showAlert = true;
    getCryptoForFiat(false);
  }
};

const resetForm = (): void => {
  form.fiatAmount = defaultFiatValue;
  form.fiatSelected = "USD";
  form.cryptoAmount = "0";
  form.cryptoSelected = "ETH";
  form.address = "";
  debounce_getCryptoForFiat();
};

const debounce_getCryptoForFiat = debounce(() => {
  getCryptoForFiat(false);
}, apiDebounceTime);
const debounce_getFiatForCrypto = debounce(() => {
  getFiatForCrypto();
}, apiDebounceTime);

const verifyAddress = (): void => {
  const valid = WAValidator.validate(form.address, form.cryptoSelected);
  if (valid) {
    form.addressErrorMsg = "";
    form.addressError = false;
  } else {
    if (!form.address) {
      form.addressErrorMsg = "";
    } else {
      form.addressErrorMsg = `Please provide a valid ${form.cryptoSelected} address`;
    }
  }
};

const submitForm = (): void => {
  loading.processingBuyForm = true;
  executeSimplexPayment(
    form.fiatSelected,
    form.cryptoSelected,
    form.fiatSelected,
    form.fiatAmount,
    form.address
  );
};
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
