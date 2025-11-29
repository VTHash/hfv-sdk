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
      baseURL: client.apiBaseUrl,
      timeout: 20000
    })
  }

  /**
   * Ask HFV backend for a bridge quote (fees, route, expected output).
   * Backend route: POST /bridge/quote
   */
  async getQuote(params: BridgeQuoteParams): Promise<BridgeQuote & { quoteId?: string }> {
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
   * Execute a bridge via the HFV backend.
   * Backend route: POST /bridge/execute
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
   * Poll bridge status (via trackingId).
   * Backend route: GET /bridge/status?id=...
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