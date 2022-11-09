// const getCoinGeckoTokenById = (cgid: string) => {
//   const cgToken = state.coinGeckoTokens.get(cgid);
//   return {
//     name: cgToken ? cgToken.symbol.toUpperCase() : '',
//     symbol: cgToken ? cgToken.symbol.toUpperCase() : '',
//     subtext: cgToken ? cgToken.name : '',
//     value: cgToken ? cgToken.name : '',
//     img: cgToken ? `https://img.mewapi.io/?image=${cgToken.image}` : '',
//     market_cap: cgToken ? cgToken.market_cap : '0',
//     market_capf: cgToken ? formatIntegerValue(cgToken.market_cap).value : '0',
//     price_change_percentage_24h: cgToken
//       ? cgToken.price_change_percentage_24h
//       : '0',
//     price_change_percentage_24hf:
//       cgToken && cgToken.price_change_percentage_24h
//         ? formatPercentageValue(cgToken.price_change_percentage_24h).value
//         : '0',
//     price: cgToken ? cgToken.current_price : '0',
//     pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0'
//   };
// };

// /**
//  * Get Token info including market data if exists
//  */
// const contractToToken = (contractAddress: string) => {
//     if (!contractAddress) {
//       return null;
//     }
//     contractAddress = contractAddress.toLowerCase();
//     let tokenId = platformList[contractAddress];
//     let cgToken;
//     if (contractAddress === MAIN_TOKEN_ADDRESS) {
//       tokenId = rootGetters['global/network'].type.coingeckoID;
//       cgToken = getCoinGeckoTokenById(tokenId);
//       const networkType = rootGetters['global/network'].type;
//       return Object.assign(cgToken, {
//         name: networkType.currencyName,
//         symbol: networkType.currencyName,
//         subtext: networkType.name_long,
//         value: networkType.name_long,
//         contract: MAIN_TOKEN_ADDRESS,
//         img: cgToken.img !== '' ? cgToken.img : networkType.icon,
//         decimals: 18
//       });
//     }
//     cgToken = getters.getCoinGeckoTokenById(tokenId);
//     const networkToken = state.networkTokens.get(contractAddress);

//     if (!networkToken) return null;
//     return Object.assign(cgToken, {
//       name: networkToken.name,
//       symbol: networkToken.symbol,
//       subtext: networkToken.name,
//       value: networkToken.name,
//       contract: networkToken.address,
//       img: networkToken.icon_png ? networkToken.icon_png : '',
//       decimals: networkToken.decimals
//     });
// };