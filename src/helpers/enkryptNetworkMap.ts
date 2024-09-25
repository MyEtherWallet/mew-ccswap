import { NetworkNames } from '@enkryptcom/types';

export default (networkName: string): string => {
  const supportedMap: { [key: string]: string } = {
    [NetworkNames.Ethereum]: 'ETH',
    [NetworkNames.Arbitrum]: 'ARB',
    [NetworkNames.Avalanche]: 'AVAX',
    [NetworkNames.Base]: 'BASE',
    [NetworkNames.Bitcoin]: 'BTC',
    [NetworkNames.Celo]: 'CELO',
    [NetworkNames.Dogecoin]: 'DOGE',
    [NetworkNames.Polkadot]: 'DOT',
    [NetworkNames.EthereumClassic]: 'ETC',
    [NetworkNames.Kadena]: 'KDA',
    [NetworkNames.Kusama]: 'KSM',
    [NetworkNames.Litecoin]: 'LTC',
    [NetworkNames.Matic]: 'POL',
    [NetworkNames.Optimism]: 'OP',
  }

  return supportedMap[networkName];
} 