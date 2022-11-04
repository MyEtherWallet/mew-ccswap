<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
    <div>
      <div
        class="d-flex align-center textDark--text mb-10 cursor--pointer"
        @click="$emit('close')"
      >
        <v-icon color="textDark">mdi-arrow-left mr-4</v-icon>
        <div class="mew-heading-2">Select provider</div>
      </div>
  
      <!-- ============================================================== -->
      <!-- Moonpay -->
      <!-- ============================================================== -->
      <div v-if="!hideMoonpay" class="section-block pa-5 mb-6">
        <img
          class="provider-logo"
          :src="moonpayLogo"
          alt="Moonpay"
          height="18"
        />
        <div class="mb-3">
          <div class="d-flex mb-1 align-center justify-space-between">
            <div class="d-flex mew-heading-3 textDark--text">
              {{ buyObj.cryptoToFiat }}
              <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
            </div>
          </div>
          <div class="d-flex align-center">
            <div class="mr-1 textDark--text">≈ {{ buyObj.plusFeeF }}</div>
            <v-tooltip style="height: 21px">
              <template #contentSlot>
                <div>
                  {{ buyObj.includesFeeText }}
                  <br />
                  <br />
                  {{ buyObj.networkFeeText }}
                  <br />
                  <br />
                  {{ buyObj.dailyLimit }}
                  <br />
                  {{ buyObj.monthlyLimit }}
                </div>
              </template>
            </v-tooltip>
          </div>
        </div>
  
        <div class="d-flex align-center mb-1">
          <img
            :src="visaIcon"
            alt="Visa"
            height="24"
            class="mr-2"
          />
          <img
            :src="masterIcon"
            alt="Master"
            height="24"
            class="mr-2"
          />
          <img
            :src="applePayIcon"
            alt="ApplePay"
            height="24"
            class="mr-2"
          />
          <img
            v-if="isEUR"
            :src="bankIcon"
            alt="Bank"
            height="24"
          />
        </div>
        <div class="mew-label mb-5">
          {{ paymentOptionString }}
        </div>
        <div>
          <v-btn
            btn-size="large"
            btn-style="light"
            color-theme="basic"
            has-full-width
            :is-valid-address-func="isValidToAddress"
            @click.native="buy"
          >{{moonpayBtnTitle}}</v-btn>
        </div>
      </div>
  
      <!-- ============================================================== -->
      <!-- Simplex -->
      <!-- ============================================================== -->
      <div v-if="!hideSimplex" class="section-block pa-5">
        <div v-if="!loading" class="mb-3">
          <div class="d-flex mb-1 align-center justify-space-between">
            <div class="d-flex mew-heading-3 textDark--text">
              {{ simplexQuote.cryptoToFiat }}
              <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
            </div>
          </div>
          <div class="d-flex align-center">
            <div class="mr-1 textDark--text">
              ≈ {{ currencyFormatter(simplexQuote.fiatAmount) }}
            </div>
            <v-tooltip style="height: 21px">
              <template #contentSlot>
                <div>
                  {{ simplexQuote.includesFeeText }}
                  <br />
                  <br />
                  {{ simplexQuote.networkFeeText }}
                  <br />
                  <br />
                  {{ simplexQuote.dailyLimit }}
                  <br />
                  {{ simplexQuote.monthlyLimit }}
                </div>
              </template>
            </v-tooltip>
          </div>
        </div>
  
        <div v-else class="mb-3">
          <!-- v-skeleton-loader is not supported in Vuetify 3 -->
          <!-- <v-skeleton-loader type="heading" class="mb-1" />
          <v-skeleton-loader max-width="200px" type="heading" /> -->
        </div>
  
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-start mb-1">
            <img
              :src="visaIcon"
              alt="Visa"
              height="24"
              class="mr-2"
            />
            <img
              :src="masterIcon"
              alt="Master"
              height="24"
              class="mr-2"
            />
          </div>
          <img
            class="provider-logo"
            :src="simplexLogo"
            alt="Simplex"
            height="28"
          />
        </div>
        <div class="mew-label mb-5">Visa, Mastercard</div>
        <div>
          <v-btn
            btn-size="large"
            btn-style="light"
            color-theme="basic"
            has-full-width
            @click.native="openSimplex"
          >{{simplexBtnTitle}}</v-btn>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import MultiCoinValidator from 'multicoin-address-validator';
//   import { mapGetters, mapActions, mapState } from 'vuex';
  
//   import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
//   import { LOCALE } from '../helpers';

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BuyProviders',
    props: {
      orderHandler: {
        type: Object,
        default: () => ({})
      },
      close: {
        type: Function,
        default: () => ({})
      },
      onlySimplex: {
        type: Boolean,
        default: false
      },
      selectedFiat: {
        type: Object,
        default: () => ({})
      },
      selectedCurrency: {
        type: Object,
        default: () => ({})
      },
      buyObj: {
        type: Object,
        default: () => ({})
      },
      simplexQuote: {
        type: Object,
        default: () => ({})
      },
      toAddress: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: false
      };
    },
    computed: {
      selectedFiatName() {
        return this.selectedFiat.name;
      },
      actualAddress() {
        return this.toAddress;
      },
      selectedCryptoName() {
        return this.selectedCurrency.symbol;
      },
      isEUR() {
        return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
      },
      hideMoonpay() {
        return this.onlySimplex;
      },
      hideSimplex() {
        return (
          this.selectedCryptoName === 'USDC' || this.selectedCryptoName === 'USDT'
        );
      },
      simplexBtnTitle() {
        return 'BUY WITH SIMPLEX';
      },
      moonpayBtnTitle() {
        return 'BUY WITH MOONPAY';
      },
      paymentOptionString() {
        return `Visa, Mastercard, Apple Pay${this.isEUR ? ', Bank account' : ''}`;
      },
      visaIcon() {
        return require('@/assets/images/icon-visa.svg');
      },
      masterIcon() {
        return require('@/assets/images/icon-master.svg');
      },
      bankIcon() {
        return require('@/assets/images/icon-bank.svg');
      },
      applePayIcon() {
        return require('@/assets/images/icon-apple-pay.svg');
      },
      simplexLogo() {
        return require('@/assets/images/icon-simplex.svg');
      },
      moonpayLogo() {
        return require('@/assets/images/icon-moonpay.svg');
      }
    },
    methods: {
      isValidToAddress(address: string) {
        return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
      },
      openSimplex() {
        this.orderHandler
          .simplexBuy(
            this.selectedCryptoName,
            this.selectedFiatName,
            this.buyObj.fiatAmount,
            this.actualAddress
          )
          .then(() => {
            this.reset();
            this.close();
            this.$emit('reset');
          })
          .catch((err: Error) => {
            this.reset();
            // Toast(err, {}, ERROR);
            this.close();
            this.$emit('reset');
          });
      },
      currencyFormatter(value: number) {
        const locale = 'en-US';
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: this.selectedFiatName
        }).format(value);
      },
      reset() {
        this.loading = true;
        // this.fetchData = {};
      },
      buy() {
        this.orderHandler
          .buy(
            this.selectedCryptoName,
            this.selectedFiatName,
            this.buyObj.fiatAmount,
            this.actualAddress
          )
          .then(() => {
            this.reset();
            this.close();
            this.$emit('reset');
          })
          .catch((err: Error) => {
            this.reset();
            // Toast(err, {}, ERROR);
            this.close();
            this.$emit('reset');
          });
      }
    }
  });
</script>
  
  <style lang="scss" scoped>
  .section-block {
    border-radius: 12px;
    left: 0px;
    top: 0px;
    box-sizing: border-box;
    border: 1px solid var(--v-greyMedium-base);
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: 8px 0px;
    position: relative;
  }
  .provider-logo {
    position: absolute;
    top: 18px;
    right: 20px;
  }
  </style>