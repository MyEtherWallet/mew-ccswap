<template>
  <div class="buy-btc">
    <div class="page-container">
      <div class="block-division">
        <div class="block-1">
          <div class="mew-logo-container">
            <img class="mew-logo-image" src="@/assets/images/logo.png" />
          </div>
          <div class="text-contents">
            <h1 class="large-title">Buy Ethereum at Lower Rates</h1>
          </div>
          <div class="powered-by">
            <div class="simplex">
              <span>Powered by</span>
              <img class="mew-logo-image" src="@/assets/images/simplex.png" />
            </div>
            <div class="visa-master">
              <span>We accept Visa and MasterCard</span>
              <img
                class="mew-logo-image"
                src="@/assets/images/visa-master.png"
              />
            </div>
          </div>
        </div>
        <div class="block-2">
          <div class="buy-form-container">
            <div class="price-amount">
              <div class="price">
                <h4>Price</h4>
                <div class="input-form">
                  <div>
                    <input
                      v-model.number="fiatAmount"
                      type="number"
                      min="0"
                      name="fiat_amount"
                      :class="{ 'invalid-field': isInvalidFiatAmount }"
                    />
                  </div>
                  <!-------------------------------vv Hard Coded Placeholder Area For Fiat Select vv---------------------------------->
                  <!-------------------------------vv Hard Coded Placeholder Area For Fiat Select vv---------------------------------->
                  <div>
                    <!-- <select v-model="fiatCurrency"> -->
                    <!-- eslint-disable vue/require-v-for-key -->
                    <!-- <option v-for="fiat in validFiat" v-bind:value="fiat">
                        {{ fiat }}
                      </option>
                    </select> -->

                    <select>
                      <option>USD</option>
                    </select>
                    <!---------------------------------- Ends Here ---------------------------------------------------------->
                    <!---------------------------------- Ends Here ---------------------------------------------------------->
                  </div>
                </div>
                <span v-if="isInvalidFiatBelow" style="color: red"
                  >Entered Value Below Minimum</span
                >
                <span v-if="isInvalidFiatAbove" style="color: red"
                  >Entered Value Above Maximum</span
                >
              </div>
              <div class="amount">
                <h4>Amount</h4>
                <div class="input-form">
                  <div>
                    <input
                      v-model.number="digitalAmount"
                      type="number"
                      min="0"
                      name="digital_amount"
                      :class="{ 'invalid-field': isInvalidDigitalAmount }"
                    />
                  </div>
                  <!-------------------------------vv Hard Coded Placeholder Area For Crypto Select vv---------------------------------->
                  <!-------------------------------vv Hard Coded Placeholder Area For Crypto Select  vv---------------------------------->
                  <div>
                    <!-- <select v-model="digitalCurrency"> -->
                    <!-- eslint-disable vue/require-v-for-key -->
                    <!-- <option
                        v-for="digital in validDigital"
                        v-bind:value="digital"
                      >
                        {{ digital }}
                      </option> -->
                    <!--TODO: <option v-for=""></option-->
                    <!-- </select> -->

                    <select>
                      <option>ETH</option>
                    </select>
                    <!---------------------------------- Ends Here ---------------------------------------------------------->
                    <!---------------------------------- Ends Here ---------------------------------------------------------->
                  </div>
                </div>
              </div>
            </div>

            <!-- .price-amount -->
            <div class="btc-address">
              <h4 v-if="digitalCurrency === 'BTC'">
                BTC Address
                <span
                  ><a
                    href="https://www.myetherwallet.com"
                    target="_blank"
                    style="text-decoration: none"
                    >Don't have one?</a
                  ></span
                >
              </h4>
              <!-------------------------------vv Hard Coded Placeholder Area For Above vv---------------------------------->
              <!-------------------------------vv Hard Coded Placeholder Area For Above vv---------------------------------->
              <h4>
                <span
                  ><a
                    href="https://www.myetherwallet.com"
                    target="_blank"
                    style="text-decoration: none"
                    >Don't have one?</a
                  ></span
                >
              </h4>
              <!---------------------------------- Ends Here ---------------------------------------------------------->
              <!---------------------------------- Ends Here ---------------------------------------------------------->
              <h4
                v-if="
                  digitalCurrency === 'ETH' ||
                  digitalCurrency === 'BNB' ||
                  digitalCurrency === 'MATIC'
                "
              >
                {{ digitalCurrency }} Address
                <span
                  ><a
                    href="https://www.myetherwallet.com/create-wallet"
                    target="_blank"
                    style="text-decoration: none"
                    >Don't have one?</a
                  ></span
                >
              </h4>
              <!-------------------------------vv Hard Coded Placeholder Area For Above vv---------------------------------->
              <!-------------------------------vv Hard Coded Placeholder Area For Above vv---------------------------------->
              <h4>ETH Address</h4>
              <!---------------------------------- Ends Here ---------------------------------------------------------->
              <!---------------------------------- Ends Here ---------------------------------------------------------->

              <input
                v-model="digitalAddress"
                type="text"
                name=""
                placeholder="Please enter the address"
                :class="{ 'invalid-field': isInvalidAddress }"
              />
              <div class="loading-indicator" v-show="loading">
                Loading <i class="fa fa-spinner fa-pulse"></i>
              </div>
            </div>

            <!-- .btc-address -->
            <div class="recaptcha">
              <vue-recaptcha
                :sitekey="r_site_key"
                @verify="onVerify"
              ></vue-recaptcha>
            </div>

            <checkout-form
              :continueAction="order"
              :valid-inputs="canOrder"
              :formData="formData"
            />
            <!-------------------------------vv Hard Coded Placeholder Area For Above vv---------------------------------->
            <!-------------------------------vv Hard Coded Placeholder Area For Above vv---------------------------------->
            <div class="submit-button-container">
              <button class="button-1">
                Continue<i class="fa fa-long-arrow-right"></i>
              </button>
              <p>You will be redirected to the partner's site</p>
            </div>
          </div>
          <!---------------------------------- Ends Here ---------------------------------------------------------->
          <!---------------------------------- Ends Here ---------------------------------------------------------->
          <!-- .buy-form-container -->
          <div class="powered-by-mobile">
            <div class="simplex">
              <span>Powered by</span>
              <img class="mew-logo-image" src="@/assets/images/simplex.png" />
            </div>
            <div class="visa-master">
              <span>We accept Visa and MasterCard</span>
              <img
                class="mew-logo-image"
                src="@/assets/images/visa-master.png"
              />
            </div>
          </div>
        </div>
        <!-- .block-2 -->
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash';
// import { getOrder } from '@/simplex-api';
//import { simplex, recaptcha } from "@/config";
import { VueRecaptcha } from "vue-recaptcha";

export default {
  name: "BuyCrypto",
  components: {
    VueRecaptcha
  },
  data() {
    return {
      //     validFiat: simplex.validFiat,
      //     validDigital: simplex.validDigital,
      //     loading: false,
      //     formData: null,
      //r_site_key: recaptcha.siteKey
      r_site_key: "6LczzE0fAAAAALKiUYa2POyGx41EnRs0zjpAxfOI"
      //     recaptchaResponse: "",
    };
  }
  //     methods: {
  //         onVerify(response) {
  //             this.recaptchaResponse = response;
  //         },
  //         order(cb) {
  //             let success = () => {
  //                 const orderInfo = this.$store.state.orderInfo;
  //                 const isInvalidFiat =
  //                     orderInfo.fiatTotal <
  //                     this.$store.state.minFiat[this.$store.state.orderInfo.fiatCurrency] ||
  //                     orderInfo.fiatTotal >
  //                     this.$store.state.maxFiat[this.$store.state.orderInfo.fiatCurrency];
  //                 if (isInvalidFiat) {
  //                     return Promise.reject(
  //                         Error(
  //                             'Invalid fiat amount provided when attempting to create order'
  //                         )
  //                     );
  //                 }
  //                 getOrder({
  //                         'g-recaptcha-response': this.recaptchaResponse,
  //                         account_details: {
  //                             app_end_user_id: orderInfo.userId
  //                         },
  //                         transaction_details: {
  //                             payment_details: {
  //                                 quote_id: orderInfo.quoteId,
  //                                 fiat_total_amount: {
  //                                     currency: orderInfo.fiatCurrency,
  //                                     amount: orderInfo.fiatTotal
  //                                 },
  //                                 requested_digital_amount: {
  //                                     currency: orderInfo.digitalCurrency,
  //                                     amount: orderInfo.digitalAmount
  //                                 },
  //                                 destination_wallet: {
  //                                     currency: orderInfo.digitalCurrency,
  //                                     address: orderInfo.digitalAddress
  //                                 }
  //                             }
  //                         }
  //                     })
  //                     .then(resp => {
  //                         resp = resp.data;
  //                         if (!resp.error) {
  //                             this.formData = resp.result;
  //                             this.$nextTick(() => {
  //                                 cb();
  //                             });
  //                         } else console.log(resp);
  //                     })
  //                     .catch(error => {
  //                         console.error(error);
  //                     });
  //             };
  //             let failed = err => console.log(err);
  //             if (this.canOrder) {
  //                 if (
  //                     simplex.validFiat.includes(
  //                         this.$store.state.orderInfo.requestedCurrency
  //                     )
  //                 ) {
  //                     this.$store
  //                         .dispatch('setFiatAmount', this.$store.state.orderInfo.fiatTotal)
  //                         .then(success)
  //                         .catch(failed);
  //                 } else {
  //                     this.$store
  //                         .dispatch(
  //                             'setDigitalAmount',
  //                             this.$store.state.orderInfo.digitalAmount
  //                         )
  //                         .then(success)
  //                         .catch(failed);
  //                 }
  //             }
  //         }
  //     },
  //     mounted() {
  //         this.$store.dispatch('setCurrencyMaxAndMins');
  //         this.$store.dispatch('setDigitalAmount', 1);
  //     },
  //     computed: {
  //         digitalAddress: {
  //             get() {
  //                 return this.$store.state.orderInfo.digitalAddress;
  //             },
  //             set(value) {
  //                 this.$store.dispatch('setDigitalAddress', value);
  //             }
  //         },
  //         fiatAmount: {
  //             get() {
  //                 return this.$store.state.orderInfo.fiatTotal;
  //             },
  //             set: _.debounce(function (value) {
  //                 this.loading = true;
  //                 this.$store.dispatch('setFiatAmount', value).finally(() => {
  //                     this.loading = false;
  //                 });
  //             }, 750)
  //         },
  //         digitalAmount: {
  //             get() {
  //                 return this.$store.state.orderInfo.digitalAmount;
  //             },
  //             set: _.debounce(function (value) {
  //                 this.loading = true;
  //                 this.$store.dispatch('setDigitalAmount', value).finally(() => {
  //                     this.loading = false;
  //                 });
  //             }, 750)
  //         },
  //         fiatCurrency: {
  //             get() {
  //                 return this.$store.state.orderInfo.fiatCurrency;
  //             },
  //             set(value) {
  //                 this.loading = true;
  //                 this.$store.dispatch('setFiatCurrency', value).finally(() => {
  //                     this.loading = false;
  //                 });
  //             }
  //         },
  //         digitalCurrency: {
  //             get() {
  //                 return this.$store.state.orderInfo.digitalCurrency;
  //             },
  //             set(value) {
  //                 this.loading = true;
  //                 this.$store.dispatch('setDigitalCurrency', value).finally(() => {
  //                     this.loading = false;
  //                 });
  //             }
  //         },
  //         isInvalidFiatAmount: {
  //             get() {
  //                 return this.$store.state.status.invalidFiatAmount;
  //             }
  //         },
  //         isInvalidFiatAbove: {
  //             get() {
  //                 return this.$store.state.status.invalidFiatAbove;
  //             }
  //         },
  //         isInvalidFiatBelow: {
  //             get() {
  //                 return this.$store.state.status.invalidFiatBelow;
  //             }
  //         },
  //         isInvalidDigitalAmount: {
  //             get() {
  //                 return this.$store.state.status.invalidDigitalAmount;
  //             }
  //         },
  //         isInvalidAddress: {
  //             get() {
  //                 return this.$store.state.status.invalidAddress;
  //             }
  //         },
  //         canOrder: {
  //             get() {
  //                 return true;
  //                 // return !this.isInvalidAddress && !this.isInvalidDigitalAmount && !this.isInvalidFiatAmount && this.recaptchaResponse;
  //             }
  //         }
  //     },
};
</script>

<style lang="scss" scoped>
@import "@/var.scss";
@import "BuyCrypto.scss";
</style>
