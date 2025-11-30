export type HFVEnvironment = 'mainnet' | 'testnet'

export interface HFVSDKConfig {
  /**
   * Network environment your backend + Wormhole use.
   */
  env?: HFVEnvironment

  /**
   * Base URL of your HFV API backend (where bridge + prices endpoints live).
   * Example: "https://api.hfvprotocol.org" or "http://localhost:4000/api"
   */
  apiBaseUrl?: string
}

export const HFV_API_BASE_URL = process.env.HFV_API_BASE_URL ||
'https://hfv-api.onrender.com'

export const defaultConfig: Required<HFVSDKConfig> = {
  env: 'mainnet',
  apiBaseUrl: 'https://api.hfvprotocol.org'
}