export type HFVEnvironment = 'mainnet' | 'testnet'

export interface HFVSDKConfig {
  env?: HFVEnvironment
  apiBaseUrl?: string
}

/**
 * Detect if running inside Vite browser environment.
 */
const isVite =
  typeof import.meta !== 'undefined' &&
  typeof import.meta.env !== 'undefined' &&
  !!import.meta.env.VITE_HFV_API_BASE_URL

/**
 * Correct universal ENV loader:
 * - In Vite → uses import.meta.env.VITE_*
 * - In Node / backend → uses process.env.*
 */
export const HFV_API_BASE_URL: string = isVite
  ? import.meta.env.VITE_HFV_API_BASE_URL ||
    'https://hfv-api.onrender.com'
  : process.env.HFV_API_BASE_URL ||
    'https://hfv-api.onrender.com'

export const defaultConfig: Required<HFVSDKConfig> = {
  env: 'mainnet',
  apiBaseUrl: HFV_API_BASE_URL
}