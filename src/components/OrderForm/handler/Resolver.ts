import NameResolver, { CoinType } from "@enkryptcom/name-resolution";
import { createWeb3Name } from "@web3-name-sdk/core";

import * as nameHash from "eth-ens-namehash";
import { zeroAddress } from "viem";
import { isAddress } from "web3-utils";
import { resolvedName } from "../types";
import { Network } from "../network/types";

const normalise = function (str: string) {
  return nameHash.normalize(str);
}

export default class Resolver {
  private network: Network;
  private web3Name: any;
  private resolver: NameResolver;

  constructor(network: Network) {
    this.network = network;
    this.web3Name = createWeb3Name();
    this.resolver = new NameResolver({
      ens: {
        node: 'https://nodes.mewapi.io/rpc/eth'
      },
      sid: {
        node: {
          bnb: 'https://nodes.mewapi.io/rpc/bsc',
          arb: 'https://nodes.mewapi.io/rpc/arb'
        }
      }
    })
  }

  isValidName(name: string) {
    const splitName = name.split('.');
    if (splitName.length > 1) {
      name = normalise(name);
      return name.indexOf('.') > 0;
    }
  }

  /*
  * Resolve name to address
  * @param name - The name to resolve
  * @param type - The type of coin to resolve
  * @returns The resolved address
  */
  async resolveName(name: string, type: CoinType) {
    if (!this.isValidName(name)) {
      throw new Error('Invalid name!');
    }
    name = normalise(name);
    const address: string | null = await this.resolver.resolveAddress(name, type);
    if (address !== null && isAddress(address) && address !== zeroAddress) {
      return address;
    }
    throw new Error('Invalid address!');
  }

  async resolveAddress(address: string) {
    if (isAddress(address) && address !== zeroAddress) {
      let resolvedName: resolvedName | null | string = await this.resolver.resolveReverseName(address);
      if (!resolvedName) {
        resolvedName = await this.web3Name.getDomainName({
          address: address,
          queryChainIdList: [this.network.chainID]
        });
      }
      return {
        name: (resolvedName as resolvedName)?.name ? (resolvedName as resolvedName).name : resolvedName ? resolvedName : '',
      }
    }
  }
}