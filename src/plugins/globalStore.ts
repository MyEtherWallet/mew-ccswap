import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { Crypto, Fiat, Network, Assets, Providers, NewFiat } from "@/components/OrderForm/types";
import { Networks } from "@/components/OrderForm/network/networks";

export const useGlobalStore = defineStore('global', () => {
  const isTokenModalOpen = ref(false);
  const selectedFiat = ref({
    name: "USD",
    value: "USD",
    // eslint-disable-next-line
    img: require(`@/assets/images/fiat/USD.svg`),
  });
  const selectedCrypto = ref({
    decimals: 18,
    img: require("@/assets/images/crypto/ETH.svg"),
    name: "ETH",
    subtext: "Ethereum",
    value: "ETH",
    symbol: "ETH",
    network: "ETH",
  });
  const selectedNetwork = ref(Networks[0]);
  const networks = ref<Assets[]>([]);
  const providers = ref<Providers[]>([]);

  const fiats = computed(() => {
    const newArray = <NewFiat[]>[];
    providers.value.forEach((provider) => {
      provider.fiats.forEach((fiat) => {
        const added = newArray.findIndex((item) => item.fiat_currency === fiat.fiat_currency);
        if (added !== -1) {
          const max = newArray[added].limits.max;
          const min = newArray[added].limits.min;
          newArray[added].limits = {
            max: fiat.limits.max > max ? fiat.limits.max : max,
            min: fiat.limits.min < min ? fiat.limits.min : min
          }
        }
      });
    })
    return newArray;
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