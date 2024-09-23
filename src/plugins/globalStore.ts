import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { Crypto, Fiat, Assets, Providers, NewFiat, BuyProviders } from "@/components/OrderForm/types";
import { Network } from "@/components/OrderForm/network/types";
import { Networks } from "@/components/OrderForm/network/networks";
import { defaultCrypto, defaultFiat } from "@/components/OrderForm/handler/defaults";
import networkConverter from "@/components/OrderForm/network/networkConverter";

export const useGlobalStore = defineStore('global', () => {
  const isTokenModalOpen = ref(false);
  const isBuyProvidersOpen = ref(false);
  const selectedFiat = ref(defaultFiat);
  const selectedCrypto = ref(defaultCrypto);
  const selectedNetwork = ref(Networks[0]);
  const buyNetworks = ref<Network[]>([]);
  const sellNetworks = ref<Network[]>([]);
  const providers = ref<Providers[]>([]);
  const buyProviders = ref<BuyProviders[]>([]);
  const cgPrice = reactive(new Map());
  const conversionRates = reactive(new Map());

  const buyFiats = computed(() => {
    const fiatsMap = new Map<string, NewFiat>();
    providers.value.forEach((provider) => {
      provider.fiats.forEach((fiat) => {
        const fiatMap = fiatsMap.get(fiat.fiat_currency);
        if (fiatMap) {
          const max = fiatMap.limits.max;
          const min = fiatMap.limits.min;
          fiatMap.limits = {
            max: fiat.limits.max > max ? fiat.limits.max : max,
            min: fiat.limits.min < min ? fiat.limits.min : min
          }
          fiatMap.img = require(`@/assets/images/fiat/${fiat.fiat_currency}.svg`);
          fiatsMap.set(fiat.fiat_currency, fiatMap);
        } else {
          fiat.img = require(`@/assets/images/fiat/${fiat.fiat_currency}.svg`);
          fiatsMap.set(fiat.fiat_currency, fiat);
        }
      });
    })
    return fiatsMap;
  })

  const sellFiats = computed(() => {
    const fiatsMap = new Map<string, NewFiat>();
    const moonpay = providers.value.find((provider) => provider.provider === 'MOONPAY');
    if (moonpay) {
      moonpay.fiats.forEach((fiat) => {
        const fiatMap = fiatsMap.get(fiat.fiat_currency);
        if (fiatMap) {
          const max = fiatMap.limits.max;
          const min = fiatMap.limits.min;
          fiatMap.limits = {
            max: fiat.limits.max > max ? fiat.limits.max : max,
            min: fiat.limits.min < min ? fiat.limits.min : min
          }
          fiatMap.img = require(`@/assets/images/fiat/${fiat.fiat_currency}.svg`);
          fiatsMap.set(fiat.fiat_currency, fiatMap);
        } else {
          fiat.img = require(`@/assets/images/fiat/${fiat.fiat_currency}.svg`);
          fiatsMap.set(fiat.fiat_currency, fiat);
        }
      });
    }
    return fiatsMap;
  })

  const allCryptos = computed(() => {
    return buyNetworks.value.flatMap((network) => network.tokens);
  })

  const toggleTokenModal = () => {
    isTokenModalOpen.value = !isTokenModalOpen.value;
  }
  const toggleBuyProviders = () => {
    isBuyProvidersOpen.value = !isBuyProvidersOpen.value;
    if (!isBuyProvidersOpen.value) {
      buyProviders.value = [];
    }
  }

  const setSelectedFiat = (fiat: Fiat) => {
    selectedFiat.value = fiat;
  }

  const setSelectedCrypto = (crypto: Crypto) => {
    selectedCrypto.value = crypto;
  }

  const setSelectedNetwork = (network: Network) => {
    selectedNetwork.value = network;
  }

  const setCgPrice = (price: Array<{ id: string, usd: number, last_updated_iso8601: string }>) => {
    price.forEach((p) => {
      cgPrice.set(p.id, p.usd);
    })
  }
  const setExchangeRates = (rates: Array<{ fiat_currency: string, exchange_rate: number }>) => {
    rates.forEach((p) => {
      conversionRates.set(p.fiat_currency, p.exchange_rate);
    })
  }

  const setNetworks = (passedNetwork: Array<Assets>) => {
    const sellSupportedTokens = ['0xdac17f958d2ee523a2206206994597c13d831ec7', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']
    const bNetworks: Array<Network> = passedNetwork.map((nw) => {
      const parsedNetwork = networkConverter(nw);
      return parsedNetwork;
    })
    const sNetworks: Array<Network> = passedNetwork.filter(nItem =>
      nItem.assets.some(asset => asset.chain === "ETH")
    ).map(nw => {
      const newTokens = nw.assets.filter(asset => asset.providers.includes("MOONPAY") && sellSupportedTokens.includes(asset.contract_address));
      nw.assets = newTokens;
      const parsedNetwork = networkConverter(nw);
      return parsedNetwork;
    })

    const findCurrentSelected = bNetworks.find((nw) => nw.name === selectedNetwork.value.name);
    // setSelectedNetwork();
    if (findCurrentSelected) {
      setSelectedNetwork(findCurrentSelected);
    }
    buyNetworks.value = bNetworks;
    sellNetworks.value = sNetworks;
  }

  // providers for buy quotes
  const setProviders = (passedProviders: Array<Providers>) => {
    providers.value = passedProviders;
  }

  // providers for actual buy transactions
  // gets cleared when buy modal is closed
  const setBuyProviders = (passedProviders: Array<BuyProviders>) => {
    buyProviders.value = passedProviders;
  }

  return {
    buyFiats,
    cgPrice,
    buyNetworks,
    sellNetworks,
    isTokenModalOpen,
    isBuyProvidersOpen,
    selectedFiat,
    selectedCrypto,
    selectedNetwork,
    allCryptos,
    buyProviders,
    conversionRates,
    sellFiats,
    toggleTokenModal,
    toggleBuyProviders,
    setSelectedFiat,
    setSelectedCrypto,
    setSelectedNetwork,
    setNetworks,
    setProviders,
    setBuyProviders,
    setCgPrice,
    setExchangeRates
  }
})