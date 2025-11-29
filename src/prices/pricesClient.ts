import axios, { type AxiosInstance } from 'axios'
import { HFVClient } from '../client'
import { getAllSupportedChains } from '../chains/chainUtils'

export type NativePriceMap = Record<number, number> // chainId -> usd
export type TokenPriceMap = Record<string, number> // address -> usd

export class HFVPrices {
  private client: HFVClient
  private http: AxiosInstance

  constructor(client: HFVClient) {
    this.client = client
    this.http = axios.create({
      baseURL: client.apiBaseUrl,
      timeout: 15000
    })
  }

  /**
   * Get USD prices for native gas tokens on multiple chains.
   * If chainIds is omitted, it defaults to ALL SUPPORTED_CHAINS.
   * Backend route: GET /prices/native?chainIds=1,56,137
   */
  async getNativePrices(chainIds?: number[]): Promise<NativePriceMap> {
    const ids =
      chainIds && chainIds.length
        ? chainIds
        : getAllSupportedChains().map((c) => c.chainId)

    if (!ids.length) return {}

    const param = ids.join(',')
    const { data } = await this.http.get('/prices/native', {
      params: { chainIds: param }
    })

    return data?.prices || {}
  }

  /**
   * Get USD prices for ERC-20 tokens on a specific chain.
   * Backend route: POST /prices/tokens
   */
  async getTokenPrices(chainId: number, addresses: string[]): Promise<TokenPriceMap> {
    if (!chainId || !addresses.length) return {}

    const { data } = await this.http.post('/prices/tokens', {
      chainId,
      addresses
    })

    return data?.prices || {}
  }
}