import { getIcon } from "./networks";
import { Network, Crypto } from "./types";
import { NewToken } from "@/components/OrderForm/types";
import { isEmpty } from "lodash";

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

  network.assets.forEach((asset: NewToken) => {
    if (tokens.some((token) => token.symbol === asset.symbol || token.name === asset.market_data?.name)) return; // Prevent duplicates
    const token: Crypto = {
      img: '',
      name: asset.market_data && !isEmpty(asset.market_data) ? asset.market_data.name : asset.symbol,
      subtext: asset.symbol,
      value: asset.symbol,
      symbol: asset.symbol,
      network: network.chain,
      decimals: 18,
      cgId: asset.coingecko_id
    }

    const icon = getIcon(asset.symbol);
    token.img = icon === '' ? !isEmpty(asset.market_data) ? asset.market_data.icon === '' ? newNetwork.icon : asset.market_data.icon : newNetwork.icon : icon;
    if (asset.market_data && !isEmpty(asset.market_data)) {
      token.price = asset.market_data.price;
    }
    tokens.push(token);
  });


  newNetwork.tokens = tokens;
  newNetwork.currencyName = network.chain;
  newNetwork.url = knownNodes[network.chain] || '';

  return newNetwork;
}