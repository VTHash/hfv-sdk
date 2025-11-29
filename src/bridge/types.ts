export interface BridgeQuoteParams {
  fromChain: string // e.g. 'Ethereum'
  toChain: string // e.g. 'Base'
  token: string // e.g. 'USDC', 'ETH'
  amount: string // human-readable, e.g. "100"
  recipient: string // destination address
}

export interface BridgeQuote {
  estimatedGasUsd: number
  estimatedOutputAmount: string
  routeName: string
  feeBreakdown: Record<string, number>
}

export interface BridgeTxParams extends BridgeQuoteParams {
  quoteId?: string
}

export interface BridgeExecutionResult {
  trackingId: string
  sourceTxHash?: string
}

export interface BridgeStatus {
  status: 'pending' | 'completed' | 'failed'
  fromChain?: string
  toChain?: string
  sourceTxHash?: string
  destTxHash?: string
  errorMessage?: string
}