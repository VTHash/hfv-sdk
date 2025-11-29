// HFV-SDK – Token Registry Loader

import fs from "fs";
import path from "path";

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

const TOKENS_DIR = path.join(__dirname, "tokens");

// -----------------------------
// Load all token JSON files
// -----------------------------

function loadTokens(): ChainTokenMap {
  const registry: ChainTokenMap = {};

  const files = fs.readdirSync(TOKENS_DIR).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const chainName = file.replace(".json", "");

    const fullPath = path.join(TOKENS_DIR, file);
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));

      // handle empty file
      if (!Array.isArray(content)) {
        registry[chainName] = [];
        continue;
      }

      registry[chainName] = content as TokenInfo[];
    } catch (err) {
      console.error(`❌ Failed to parse token file: ${file}`, err);
      registry[chainName] = [];
    }
  }

  return registry;
}

// Load immediately at startup
export const tokenRegistry: ChainTokenMap = loadTokens();

// -----------------------------
// Access Helpers
// -----------------------------

/** Get all chains in registry */
export function getSupportedChains(): string[] {
  return Object.keys(tokenRegistry);
}

/** Get tokens by chain name (e.g. 'ethereum') */
export function getTokensByChain(chain: string): TokenInfo[] {
  return tokenRegistry[chain.toLowerCase()] || [];
}

/** Get tokens by chainId number */
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
    const found = tokens.find(t => t.address.toLowerCase() === addr);
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
  return list.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
}

export default {
  tokenRegistry,
  getSupportedChains,
  getTokensByChain,
  getTokensByChainId,
  findToken,
  findTokenOnChain
};