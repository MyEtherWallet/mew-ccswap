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
              <buy-form @success="buySuccess"/>
            </template>
            <template #tabContent2>
              <sell-form />
            </template>
        </MewTabs>
      </div>
      <BuyProviders v-if="step === 1" />
    </div>
  </template>
  
<script lang="ts">
import { isEmpty } from 'lodash';

//   import nodes from '@/utils/networks';
  
//   import handler from './handlers/handlerOrder';
import MewTabs from '../MewTabs/MewTabs.vue';
import BuyForm from './BuyForm.vue';
import BuyProviders from './BuyProviders.vue';
import SellForm from './SellForm.vue';
import { defineComponent } from 'vue';
import { Fiat, Crypto, BuyObj, SubmitData } from './types';

const MAIN_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export default defineComponent({
    name: 'OrderForm',
    components: {
      MewTabs,
      BuyForm,
      SellForm,
      BuyProviders
    },
    props: {
        // Removing breaks the page for some reason
        open: Boolean
    },
    data() {
      return {
        activeTab: 0,
        orderHandler: {},
        selectedCurrency: {} as Crypto,
        selectedFiat: {} as Fiat,
        onlySimplex: false,
        buyObj: {} as BuyObj,
        step: 0,
        simplexQuote: {},
        toAddress: ''
      };
    },
    computed: {
      defaultCurrency() {
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
            img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
            name: 'ETH',
            subtext: 'Ethereum',
            value: 'ETH',
            symbol: 'ETH',
            network: 'ETH',
            contract: MAIN_TOKEN_ADDRESS
          };
        }
        return this.selectedCurrency;
      },
    //   supportedBuy() {
    //     return (
    //       this.network.type.name === 'ETH' ||
    //       this.network.type.name === 'BSC' ||
    //       this.network.type.name === 'MATIC'
    //     );
    //   },
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
    //   setTokens() {
    //     if (!this.inWallet) {
    //       const tokenMap = new Map();
    //       const tokens = this.network.type.tokens;
    //       if (tokens instanceof Promise) {
    //         tokens.then(tokens => {
    //           tokens.forEach(token => {
    //             tokenMap.set(token.address.toLowerCase(), token);
    //           });
    //           this.setNetworkTokens(tokenMap);
    //         });
    //       } else {
    //         this.network.type.tokens.forEach(token => {
    //           tokenMap.set(token.address.toLowerCase(), token);
    //         });
    //         this.setNetworkTokens(tokenMap);
    //       }
    //     }
    //   },
      close() {
        this.activeTab = 0;
        this.step = 0;
        this.onlySimplex = false;
      },
      setSelectedCurrency(e: Crypto) {
        this.selectedCurrency = e;
      },
      setSelectedFiat(e: Fiat) {
        this.selectedFiat = e;
      },
      openProviders(val: number) {
        this.step = val;
      },
      setBuyObj(val: BuyObj) {
        this.buyObj = val;
      },
      setSimplexQuote(val: any) {
        this.simplexQuote = val;
      },
      setToAddress(val: string) {
        this.toAddress = val;
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
      hideMoonpay(val: boolean) {
        this.onlySimplex = val;
      },
      buySuccess(data: SubmitData) {
        this.setSimplexQuote(data.simplex_quote);
        this.setToAddress(data.address);
        this.setBuyObj(data.buy_obj);
        this.openProviders(data.open_providers);
        this.setSelectedCurrency(data.selected_currency);
        this.setSelectedFiat(data.selected_fiat);
      }
    }
  });
  </script>
  
  <style lang="scss" scoped></style>