export interface TokenInfo {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  priceUSD?: number;
  coinKey?: string;
  logoURI?: string;
}

export type ChainTokenMap = Record<string, TokenInfo[]>;

// -------------------------------------------------------
// 1. IMPORT TOKEN JSON FILES
// (one import per file in src/tokens)
// -------------------------------------------------------
// ⚠️ Make sure tsconfig.json has: "resolveJsonModule": true

import abstract from './tokens/abstract.json';
import arbitrum from './tokens/arbitrum.json';
import aurora from './tokens/aurora.json';
import avalanche from './tokens/avalanche.json';
import base from './tokens/base.json';
import berachain from './tokens/berachain.json';
import blast from './tokens/blast.json';
import bob from './tokens/bob.json';
import bsc from './tokens/bsc.json';
import celo from './tokens/celo.json';
import ethereumClassic from './tokens/ethereum-classic.json';
import ethereum from './tokens/ethereum.json';
import fantom from './tokens/fantom.json';
import flare from './tokens/flare.json';
import fuse from './tokens/fuse.json';
import gnosis from './tokens/gnosis.json';
import inkonchain from './tokens/inkonchain.json';
import polygon from './tokens/polygon.json';
import optimism from './tokens/optimism.json';
import katana from './tokens/katana.json';
import klaytn from './tokens/klaytn.json';
import linea from './tokens/linea.json';
import lisk from './tokens/lisk.json';
import mantle from './tokens/mantle.json';
import mode from './tokens/mode.json';
import moonbeam from './tokens/moonbeam.json';
import moonriver from './tokens/moonriver.json';
import sei from './tokens/sei.json';
import soneium from './tokens/soneium.json';
import sonic from './tokens/sonic.json';
import swellchain from './tokens/swellchain.json';
import syscoin from './tokens/syscoin.json';
import telos from './tokens/telos.json';
import unichain from './tokens/unichain.json';
import worldcoin from './tokens/worldcoin.json';
import xdc from './tokens/xdc.json';
import zksync from './tokens/zksync.json';
import zora from './tokens/zora.json';






// -------------------------------------------------------
// 2. BUILD REGISTRY
// -------------------------------------------------------

export const tokenRegistry: ChainTokenMap = {
  abstract,
  arbitrum,
  aurora,
  avalanche,
  base,
  berachain,
  blast,
  bob,
  bsc,
  celo,
  'ethereum-classic': ethereumClassic,
  ethereum,
  fantom,
  flare,
  fuse,
  gnosis,
  polygon,
  optimism,
  inkonchain,
  katana,
  klaytn,
  linea,
  lisk,
  mantle,
  mode,
  moonbeam,
  moonriver,
  sei,
  soneium,
  sonic,
  swellchain,
  syscoin,
  telos,
  unichain,
  worldcoin,
  xdc,
  zksync,
  zora,

};

// -------------------------------------------------------
// 3. HELPERS
// -------------------------------------------------------

/** Get supported chain *names* (keys of the registry) */
export function getSupportedChains(): string[] {
  return Object.keys(tokenRegistry);
}

/** Get tokens by chain key (e.g. "ethereum", "bsc", "arbitrum") */
export function getTokensByChain(chain: string): TokenInfo[] {
  return tokenRegistry[chain.toLowerCase()] || [];
}

/** Get tokens by numeric chainId */
export function getTokensByChainId(chainId: number): TokenInfo[] {
  const entry = Object.entries(tokenRegistry).find(
    ([, tokens]) => tokens[0]?.chainId === chainId
  );
  return entry ? entry[1] : [];
}

/** Find token by address across all chains */
export function findToken(address: string): TokenInfo | undefined {
  const addr = address.toLowerCase();

  for (const tokens of Object.values(tokenRegistry)) {
    const found = tokens.find((t) => t.address.toLowerCase() === addr);
    if (found) return found;
  }
  return undefined;
}

/** Find token by symbol on a specific chain */
export function findTokenOnChain(
  chain: string,
  symbol: string
): TokenInfo | undefined {
  const list = tokenRegistry[chain.toLowerCase()];
  if (!list) return undefined;
  return list.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
}

export default {
  tokenRegistry,
  getSupportedChains,
  getTokensByChain,
  getTokensByChainId,
  findToken,
  findTokenOnChain,
};
