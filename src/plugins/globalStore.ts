import { ref, computed } from "vue";
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
  const networks = ref<Network[]>([]);
  const providers = ref<Providers[]>([]);
  const buyProviders = ref<BuyProviders[]>([]);

  const fiats = computed(() => {
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

  const allCryptos = computed(() => {
    return networks.value.flatMap((network) => network.tokens);
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

  const setNetworks = (passedNetwork: Array<Assets>) => {
    const newNetworks: Array<Network> = passedNetwork.map((nw) => {
      const parsedNetwork = networkConverter(nw);
      return parsedNetwork;
    })
    const findCurrentSelected = newNetworks.find((nw) => nw.name === selectedNetwork.value.name);
    // setSelectedNetwork();
    if (findCurrentSelected) {
      setSelectedNetwork(findCurrentSelected);
    }
    networks.value = newNetworks;

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
    fiats,
    networks,
    isTokenModalOpen,
    isBuyProvidersOpen,
    selectedFiat,
    selectedCrypto,
    selectedNetwork,
    allCryptos,
    buyProviders,
    toggleTokenModal,
    toggleBuyProviders,
    setSelectedFiat,
    setSelectedCrypto,
    setSelectedNetwork,
    setNetworks,
    setProviders,
    setBuyProviders
  }
})