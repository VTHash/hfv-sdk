import { SUPPORTED_CHAINS, type ChainMetadata } from './chainConfig'

export function getChainById(chainId: number): ChainMetadata | undefined {
  return SUPPORTED_CHAINS.find((c) => c.chainId === chainId)
}

export function getChainByKey(key: string): ChainMetadata | undefined {
  return SUPPORTED_CHAINS.find((c) => c.key === key)
}

export function getAllSupportedChains(): ChainMetadata[] {
  return SUPPORTED_CHAINS
}

export function getWormholeSupportedChains(): ChainMetadata[] {
  return SUPPORTED_CHAINS.filter((c) => c.supportedByWormhole)
}