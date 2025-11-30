import axios, { type AxiosInstance } from 'axios'
import { HFVClient } from '../client'
import type {
  BridgeQuoteParams,
  BridgeQuote,
  BridgeTxParams,
  BridgeExecutionResult,
  BridgeStatus
} from './types'

export class HFVBridge {
  private client: HFVClient
  private http: AxiosInstance

  constructor(client: HFVClient) {
    this.client = client

    this.http = axios.create({
      baseURL: client.apiBaseUrl || 'https://hfv-api.onrender.com',
      timeout: 20000
    })
  }

  /**
   * Request a bridge quote.
   * POST /bridge/quote
   */
  async getQuote(
    params: BridgeQuoteParams
  ): Promise<BridgeQuote & { quoteId?: string }> {
    const payload = { ...params, env: this.client.env }

    const { data } = await this.http.post('/bridge/quote', payload)

    return {
      estimatedGasUsd: Number(data.estimatedGasUsd ?? 0),
      estimatedOutputAmount: String(data.estimatedOutputAmount ?? '0'),
      routeName: data.routeName ?? 'default',
      feeBreakdown: data.feeBreakdown ?? {},
      quoteId: data.quoteId
    }
  }

  /**
   * Execute the bridge.
   * POST /bridge/execute
   */
  async bridge(params: BridgeTxParams): Promise<BridgeExecutionResult> {
    const payload = { ...params, env: this.client.env }

    const { data } = await this.http.post('/bridge/execute', payload)

    return {
      trackingId: data.trackingId,
      sourceTxHash: data.sourceTxHash
    }
  }

  /**
   * Track the bridge status.
   * GET /bridge/status?id=...
   */
  async getStatus(trackingId: string): Promise<BridgeStatus> {
    const { data } = await this.http.get('/bridge/status', {
      params: { id: trackingId, env: this.client.env }
    })

    return {
      status: data.status,
      fromChain: data.fromChain,
      toChain: data.toChain,
      sourceTxHash: data.sourceTxHash,
      destTxHash: data.destTxHash,
      errorMessage: data.errorMessage
    }
  }
}
