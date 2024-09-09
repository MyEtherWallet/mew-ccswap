import { Network } from './types';
export const Networks = <Array<Network>>[
  {
    name: 'ETH',
    name_long: 'Ethereum',
    chainID: 1,
    tokens: [
      {
        img: require('@/assets/images/crypto/PYUSD.png'),
        name: 'PayPal USD',
        subtext: 'PayPal USD',
        value: 'PayPal USD',
        symbol: 'PYUSD',
        network: 'ETH',
        decimals: 6
      },
      {
        img: getIcon('USDT'),
        name: 'Tether',
        subtext: 'Tether',
        value: 'Tether',
        symbol: 'USDT',
        network: 'ETH',
        decimals: 6
      },
      {
        img: getIcon('USDC'),
        name: 'USD Coin',
        subtext: 'USD Coin',
        value: 'USD Coin',
        symbol: 'USDC',
        network: 'ETH',
        decimals: 6
      },
      {
        img: getIcon('DAI'),
        name: 'Dai Stablecoin',
        subtext: 'Dai Stablecoin',
        value: 'Dai Stablecoin',
        symbol: 'DAI',
        network: 'ETH',
        decimals: 18
      },
      {
        img: require('@/assets/images/crypto/TUSD.png'),
        name: 'True USD',
        subtext: 'True USD',
        value: 'True USD',
        symbol: 'TUSD',
        network: 'ETH',
        decimals: 18
      }
    ],
    icon: getIcon('ETH'),
    currencyName: 'ETH',
    url: 'wss://nodes.mewapi.io/ws/eth',
    port: 443,
  },
  {
    name: 'BTC',
    name_long: 'Bitcoin',
    chainID: 1,
    tokens: [],
    icon: getIcon('BTC'),
    currencyName: 'BTC',
    url: '',
    port: 443,
  },
  {
    name: 'BCH',
    name_long: 'Bitcoin Cash',
    chainID: 1,
    tokens: [],
    icon: getIcon('BCH'),
    currencyName: 'BCH',
    url: '',
    port: 443,
  },
  {
    name: 'MATIC',
    name_long: 'Polygon (Matic)',
    chainID: 137,
    tokens: [
      {
        img: getIcon('USDC'),
        name: 'USD Coin (PoS)',
        subtext: 'USD Coin (PoS)',
        value: 'USD Coin (PoS)',
        symbol: 'USDC-MATIC',
        network: 'MATIC',
        decimals: 6
      },
      {
        img: getIcon('USDT'),
        name: 'Tether USD (PoS)',
        subtext: 'Tether USD (PoS)',
        value: 'Tether USD (PoS)',
        symbol: 'USDT-MATIC',
        network: 'MATIC',
        decimals: 6
      },

    ],
    icon: getIcon('MATIC'),
    currencyName: 'MATIC',
    url: 'wss://nodes.mewapi.io/ws/matic',
    port: 443,
  },
  {
    name: 'DOT',
    name_long: 'Polkadot',
    chainID: 1,
    tokens: [],
    icon: getIcon('DOT'),
    currencyName: 'DOT',
    url: '',
    port: 443,
  },
  {
    name: 'KSM',
    name_long: 'Kusama',
    chainID: 1,
    tokens: [],
    icon: getIcon('KSM'),
    currencyName: 'KSM',
    url: '',
    port: 443,
  },
  {
    name: 'LTC',
    name_long: 'Litecoin',
    chainID: 1,
    tokens: [],
    icon: getIcon('LTC'),
    currencyName: 'LTC',
    url: '',
    port: 443,
  },
  {
    name: 'SOL',
    name_long: 'Solana',
    chainID: 1,
    tokens: [],
    icon: getIcon('SOL'),
    currencyName: 'SOL',
    url: '',
    port: 443,
  },
  {
    name: 'DOGE',
    name_long: 'Dogecoin',
    chainID: 1,
    tokens: [],
    icon: getIcon('DOGE'),
    currencyName: 'DOGE',
    url: '',
    port: 443,
  },
  {
    name: 'KDA',
    name_long: 'Kadena',
    chainID: 1,
    tokens: [],
    icon: getIcon('KDA'),
    currencyName: 'KDA',
    url: '',
    port: 443,
  },
  {
    name: 'ARB',
    name_long: 'Arbitrum',
    chainID: 42161,
    tokens: [
      {
        img: getIcon('USDT'),
        name: 'Tether USD',
        subtext: 'Tether USD',
        value: 'Tether USD',
        symbol: 'USDT-ARBITRUM',
        network: 'ARB',
        decimals: 6
      }
    ],
    icon: getIcon('ARB'),
    currencyName: 'ARB',
    url: 'wss://nodes.mewapi.io/ws/arb',
    port: 443,
  },
  {
    name: 'OP',
    name_long: 'Optimism',
    chainID: 10,
    tokens: [
      {
        img: getIcon('USDT'),
        name: 'Tether USD',
        subtext: 'Tether USD',
        value: 'Tether USD',
        symbol: 'USDT-OPTIMISM',
        network: 'ARB',
        decimals: 6
      }
    ],
    icon: getIcon('OP'),
    currencyName: 'OP',
    url: 'wss://nodes.mewapi.io/ws/op',
    port: 443,
  },
];

function getIcon(currency: string) {
  try {
    return require(`@/assets/images/crypto/${currency}.svg`)
  } catch (e) {
    return ''
  }
}

export { getIcon };