import WAValidator from "multicoin-address-validator";

const CHAIN_TO_REGEXP_MAP: {
  [key: string]: RegExp
} = {
  // Existing chains
  ADA: /^(addr1[0-9a-zA-Z]{38,59}|Ae2tdPwUPEYy[0-9A-Za-z]{52,}|DdzFFzCqrht[0-9A-Za-z]{50,})$/,
  AKT: /^akash1[0-9a-z]{38}$/, // Akash address format
  ALGO: /^[A-Z2-7]{58}$/,
  APT: /^0x[a-fA-F0-9]{64}$/, // Aptos address format
  ARB: /^0x[a-fA-F0-9]{40}$/,
  ATOM: /^cosmos1[0-9a-z]{38}$/,
  AVAX: /^(X|P)-avax1[0-9a-z]{38}$|^0x[a-fA-F0-9]{40}$/,
  AXL: /^axelar1[0-9a-z]{38}$/, // Axelar address format
  BASE: /^0x[a-fA-F0-9]{40}$/,
  BCH: /^(bitcoincash:)?[qQpP][0-9a-zA-Z]{41}$|^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  BLAST: /^blast1[0-9a-z]{38}$/, // Blast address format
  BSC: /^0x[a-fA-F0-9]{40}$/,
  BTC: /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{39,59})$/,
  CELO: /^0x[a-fA-F0-9]{40}$/, // Celo address format
  CORE: /^0x[a-fA-F0-9]{40}$/, // Core address format
  DASH: /^[Xx][1-9A-HJ-NP-Za-km-z]{33}$/, // Dash address format
  DESO: /^BC1[0-9A-HJ-NP-Za-km-z]{53}$/, // Decentralized Social address format
  DOGE: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
  DOT: /^1[a-zA-Z0-9]{47}$/,
  EGLD: /^erd1[a-z0-9]{58}$/, // Elrond address format
  EOS: /^EOS[1-5]{1}[1-9A-HJ-NP-Za-km-z]{50}$/, // EOS address format
  ETC: /^0x[a-fA-F0-9]{40}$/, // Ethereum Classic address format
  ETH: /^0x[a-fA-F0-9]{40}$/,
  FIL: /^f[1-3][0-9a-zA-Z]{38}$/, // Filecoin address format
  FLOW: /^0x[a-fA-F0-9]{16}$/, // Flow address format
  FLR: /^0x[a-fA-F0-9]{40}$/, // Flare address format
  HBAR: /^0.0.[0-9]{1,5}$/, // Hedera address format
  ICP: /^[a-z2-7]{5}-[a-z2-7]{5}-[a-z2-7]{5}-[a-z2-7]{5}-[a-z2-7]{3}$/, // Internet Computer address format
  KAVA: /^kava1[0-9a-z]{38}$/, // Kava address format
  KDA: /^(k:)?[0-9a-fA-F]{64}$/,
  KSA: /^0x[a-fA-F0-9]{40}$/,
  KSM: /^G[1-9A-HJ-NP-Za-km-z]{47}$/, // Kusama address format
  LTC: /^(L|M|ltc1)[a-km-zA-HJ-NP-Z1-9]{26,49}$/,
  MATIC: /^0x[a-fA-F0-9]{40}$/,
  MINA: /^B62[a-km-zA-HJ-NP-Z1-9]{52}$/, // Mina address format
  NBL: /^0x[a-fA-F0-9]{40}$/, // Nobility address format
  NEAR: /^near1[0-9a-z]{40}$/, // NEAR address format
  OP: /^0x[a-fA-F0-9]{40}$/,
  OSMO: /^osmo1[0-9a-z]{38}$/, // Osmosis address format
  RON: /^ron1[0-9a-z]{40}$/, // Ronin address format
  ROSE: /^0x[a-fA-F0-9]{40}$/, // Oasis Network address format
  SEI: /^sei1[0-9a-z]{38}$/, // Sei Network address format
  SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  STX: /^SP[0-9a-zA-Z]{38}$/, // Stacks address format
  SUI: /^0x[a-fA-F0-9]{64}$/, // Sui address format
  TIA: /^0x[a-fA-F0-9]{40}$/, // Tia address format
  VARA: /^vara1[0-9a-z]{38}$/, // Vara address format
  VET: /^0x[a-fA-F0-9]{40}$/, // VeChain address format
  XLM: /^G[A-Z0-9]{55}$/,
  XRP: /^r[0-9a-zA-Z]{33}$/, // XRP address format
  XTZ: /^tz1[0-9a-zA-Z]{33}$/, // Tezos address format
  ZEC: /^t1[0-9A-Za-z]{33}$/, // Zcash address format
  ZEN: /^zn[0-9A-Za-z]{33}$/ // Horizen address format
}
export default (address: string, network: string): boolean => {
  if (!CHAIN_TO_REGEXP_MAP[network]) return WAValidator.validate(address, network);
  return CHAIN_TO_REGEXP_MAP[network].test(address);
}