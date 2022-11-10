<template>
    <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8">
      <div v-if="step === 0">
        <MewTabs
          :items="tabItems"
          :active-tab="activeTab"
          active-color="greenPrimary"
          has-underline
          @onTab="onTab"
        >
            <template #tabContent1>
              <buy-form 
                :crypto-selected="selectedCurrency"
                :fiat-selected="selectedFiat"
                :network-selected="selectedNetwork"
                :fiat-amount="fiatAmount"
                @setQuotes="setQuotes"
                @selectedCurrency="openTokenSelect" 
                @success="buySuccess"
              />
            </template>
            <template #tabContent2>
              <sell-form />
            </template>
        </MewTabs>
      </div>
      <TokenSelect v-if="step === 1" 
        :selected-network="selectedNetwork"
        :selected-currency="selectedCurrency"
        :fiat-selected="selectedFiat"
        :moonpay-data="moonpayData"
        :simplex-data="simplexData"
        @close="close"
        @selectCurrency="setSelectedCurrency"
      />
      <BuyProviders v-if="step === 2" 
        :selected-fiat="selectedFiat" 
        :selected-currency="selectedCurrency"
        :only-simplex="onlySimplex"
        :buy-obj="buyObj"
        :simplex-quote="simplexQuote"
        :to-address="toAddress"
        @close="close"
      />
    </div>
  </template>
  
<script lang="ts">
import { isEmpty } from 'lodash';

//   import nodes from '@/utils/networks';
  
//   import handler from './handlers/handlerOrder';
import MewTabs from '../MewTabs/MewTabs.vue';
import BuyForm from './BuyForm.vue';
import BuyProviders from './BuyProviders.vue';
import TokenSelect from './components/TokenSelect.vue';
import SellForm from './SellForm.vue';
import { defineComponent } from 'vue';
import { Fiat, Crypto, QuoteData, SubmitData, Network, Data } from './types';
import { Networks } from './networks';

export default defineComponent({
    name: 'OrderForm',
    components: {
      MewTabs,
      BuyForm,
      SellForm,
      BuyProviders,
      TokenSelect
    },
    props: {
        // Removing breaks the page for some reason
        open: Boolean
    },
    data() {
      return {
        activeTab: 0,
        orderHandler: {},
        selectedNetwork: Networks[0],
        selectedCurrency: {} as Crypto,
        selectedFiat: {} as Fiat,
        fiatAmount: '0',
        onlySimplex: false,
        buyObj: {} as QuoteData,
        step: 0,
        simplexQuote: {} as QuoteData,
        toAddress: '',
        moonpayData: {} as { [key: string]: Data },
        simplexData: {} as { [key: string]: Data }
      };
    },
    computed: {
      defaultCurrency(): Crypto {
        // if (isEmpty(this.selectedCurrency) && this.supportedBuy) {
        //   const token = this.contractToToken(MAIN_TOKEN_ADDRESS);
        //   token.value = token.symbol;
        //   return token;
        // } else 
        if (
          isEmpty(this.selectedCurrency) ||
          // !this.supportedBuy ||
          (this.activeTab === 1 && !this.supportedSell)
        ) {
          return {
            decimals: 18,
            img: require('@/assets/images/crypto/ETH.svg'),
            name: 'ETH',
            subtext: 'Ethereum',
            value: 'ETH',
            symbol: 'ETH',
            network: 'ETH'
          };
        }
        return this.selectedCurrency;
      },
      // supportedBuy() {
      //   return (
      //     this.selectedNetwork.name === 'ETH' ||
      //     this.selectedNetwork.name === 'BSC' ||
      //     this.selectedNetwork.name === 'MATIC'
      //   );
      // },
      supportedSell() {
        return (
          this.selectedCurrency.symbol === 'ETH' ||
          this.selectedCurrency.symbol === 'USDT' ||
          this.selectedCurrency.symbol === 'USDC'
        );
      },
      leftBtn() {
        return {
          method: this.close
        };
      },
      tabItems() {
        return [
            'Buy',
            'Sell'
        ];
      }
    },
    beforeMount() {
      this.selectedCurrency = this.defaultCurrency;
    },
    watch: {
      address() {
        // this.selectedCurrency = this.defaultCurrency;
      },
      network() {
        // this.selectedCurrency = {};
        // this.selectedCurrency = this.defaultCurrency;
        // this.setTokens();
      }
    },
    methods: {
      onTab(val: number) {
        this.selectedCurrency = {} as Crypto;
        this.selectedCurrency = this.defaultCurrency;
        // if (val === 1 || (val === 0 && (!this.supportedBuy || !this.inWallet))) {
        //   if (this.network.type.chainID !== 1) {
        //     const defaultNetwork = this.nodes['ETH'].find(item => {
        //       return item.service === 'myetherwallet.com-ws';
        //     });
        //     if (
        //       !this.instance ||
        //       (this.instance &&
        //         this.instance.identifier !== WALLET_TYPES.WEB3_WALLET)
        //     ) {
        //       this.setNetwork({ network: defaultNetwork }).then(() => {
        //         this.setWeb3Instance();
        //         this.activeTab = val;
        //         Toast(`Switched network to: ETH`, {}, SUCCESS);
        //       });
        //     }
        //   }
        // } else {
          this.activeTab = val;
        // }
      },
      // setTokens() {
      //   const tokenMap = new Map();
      //   const tokens = this.selectedNetwork.tokens;
      // },
      close() {
        this.activeTab = 0;
        this.step = 0;
        this.onlySimplex = false;
      },
      setSelectedCurrency(e: Crypto) {
        this.selectedCurrency = e;
        this.step = 0;
      },
      setSelectedFiat(e: Fiat) {
        this.selectedFiat = e;
      },
      openProviders(val: number) {
        this.step = val;
      },
      openTokenSelect(selectedFiat: Fiat, fiatAmount: string) {
        this.step = 1;
        this.selectedFiat = selectedFiat;
        this.fiatAmount = fiatAmount;
      },
      setBuyObj(val: QuoteData) {
        this.buyObj = val;
      },
      setSimplexQuote(val: QuoteData) {
        this.simplexQuote = val;
      },
      setToAddress(val: string) {
        this.toAddress = val;
      },
      setQuotes(simplexQuote: { [key: string]: Data }, moonpayQuote: { [key: string]: Data }) {
        this.simplexData = simplexQuote;
        this.moonpayData = moonpayQuote;
      },
      reset() {
        this.selectedCurrency = this.defaultCurrency;
        this.selectedFiat = {
          name: 'USD',
          value: 'USD',
          // eslint-disable-next-line
          img: require(`@/assets/images/fiat/USD.svg`)
        };
        this.onlySimplex = false;
      },
      disableMoonpay(val: boolean) {
        this.onlySimplex = val;
      },
      buySuccess(data: SubmitData) {
        this.setSimplexQuote(data.simplex_quote);
        this.setToAddress(data.address);
        this.setBuyObj(data.buy_obj);
        this.openProviders(data.open_providers);
        this.setSelectedCurrency(data.selected_currency);
        this.setSelectedFiat(data.selected_fiat);
        this.disableMoonpay(data.disable_moonpay);
      }
    }
  });
  </script>
  
  <style lang="scss" scoped></style>