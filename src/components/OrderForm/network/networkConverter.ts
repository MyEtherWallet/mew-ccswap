import { getIcon } from "./networks";
import { Network } from "./types";
import { Crypto } from "@/components/OrderForm/types";

const knownChainIds: { [key: string]: number } = {
  'ETH': 1,
  'BSC': 56,
  'MATIC': 137,
  'ARB': 42161,
  'OP': 10,
}

const knownNodes: { [key: string]: string } = {
  'ETH': 'https://nodes.mewapi.io/rpc/eth',
  'BSC': 'https://nodes.mewapi.io/rpc/bsc',
  'MATIC': 'https://nodes.mewapi.io/rpc/polygon',
  'ARB': 'https://nodes.mewapi.io/rpc/arb',
  'OP': 'https://nodes.mewapi.io/rpc/op',
}

const template = {
  name: '',
  name_long: '',
  chainID: 1,
  tokens: [] as Crypto[],
  icon: '',
  currencyName: '',
  url: '',
  port: 443,
}

export default (network: {
  chain: string,
  name: string,
  assets: Array<any>
}): Network => {
  const newNetwork = { ...template };
  newNetwork.name = network.chain;
  newNetwork.name_long = network.name;
  newNetwork.chainID = knownChainIds[network.chain] || 1;
  try {
    newNetwork.icon = getIcon(network.chain);
  } catch (e) {
    newNetwork.icon = '';
  }
  const tokens: Array<Crypto> = [];

  network.assets.forEach((asset: { chain: string, contract_address: string, providers: Array<string>, symbol: string }) => {
    const token: Crypto = {
      img: '',
      name: asset.symbol,
      subtext: asset.symbol,
      value: asset.symbol,
      symbol: asset.symbol,
      network: network.chain,
      decimals: 18,
    }
    try {
      token.img = getIcon(asset.symbol);
    } catch (e) {
      token.img = newNetwork.icon;
    }
    tokens.push(token);
  });


  newNetwork.tokens = tokens;
  newNetwork.currencyName = network.chain;
  newNetwork.url = knownNodes[network.chain] || '';

  return newNetwork;
}