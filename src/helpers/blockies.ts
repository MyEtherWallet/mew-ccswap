import bitcoinBlockies from './bitcoinBlockies';
import polkadotBlockies from './polkadotBlockies';
import ethereumBlockies from './ethereumBlockies';

type options = {
  size?: number;
  scale?: number;
  color?: string;
  bgcolor?: string;
  spotcolor?: string;
};

const blockiesForNetwork: { [key: string]: (address: string, opts?: options) => string } = {
  BTC: bitcoinBlockies,
  DOGE: bitcoinBlockies,
  BCH: bitcoinBlockies,
  DOT: polkadotBlockies,
}

export default (address: string, network: string, opts?: options) => {
  if (!blockiesForNetwork[network]) {
    return ethereumBlockies(address, opts || {});
  }
  console.log(address);
  return blockiesForNetwork[network](address, opts || {});
}