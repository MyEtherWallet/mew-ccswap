import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { Crypto, Fiat, Network, Assets, Providers, NewFiat } from "@/components/OrderForm/types";
import { Networks } from "@/components/OrderForm/network/networks";
import { defaultCrypto, defaultFiat } from "@/components/OrderForm/handler/defaults";

export const useGlobalStore = defineStore('global', () => {
  const isTokenModalOpen = ref(false);
  const selectedFiat = ref(defaultFiat);
  const selectedCrypto = ref(defaultCrypto);
  const selectedNetwork = ref(Networks[0]);
  const networks = ref<Assets[]>([]);
  const providers = ref<Providers[]>([]);

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

  const toggleTokenModal = () => {
    isTokenModalOpen.value = !isTokenModalOpen.value;
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
    networks.value = passedNetwork;
  }

  const setProviders = (passedProviders: Array<Providers>) => {
    providers.value = passedProviders;
  }

  return {
    fiats,
    isTokenModalOpen,
    selectedFiat,
    selectedCrypto,
    selectedNetwork,
    toggleTokenModal,
    setSelectedFiat,
    setSelectedCrypto,
    setSelectedNetwork,
    setNetworks,
    setProviders,
  }
})