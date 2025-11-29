// api/index.js
//
// HFV API server
// - GET / -> health check
// - GET /api/prices/native
// - POST /api/prices/tokens
// - POST /api/bridge/quote
// - POST /api/bridge/execute
// - GET /api/bridge/status
//
// This file is meant to be run from the project root with:
// node api/index.js
//

const path = require('path')
const express = require('express')
const cors = require('cors')

// ---- Optional: env ----
const PORT = process.env.PORT || 4000

// ---- Express app ----
const app = express()
app.use(cors())
app.use(express.json())

// ---- HEALTH CHECK (fixes "Cannot GET /") ----
app.get('/', (_req, res) => {
  res.json({
    ok: true,
    name: 'HFV API',
    version: '1.0.0',
    message: 'HFV API is running',
    docs: {
      nativePrices: '/api/prices/native?chainIds=1,56,137',
      tokenPrices: 'POST /api/prices/tokens { chainId, addresses }',
      bridgeQuote: 'POST /api/bridge/quote',
      bridgeExecute: 'POST /api/bridge/execute',
      bridgeStatus: '/api/bridge/status?id=trackingId'
    }
  })
})

/* ------------------------------------------------------------------ */
/* 1) PRICES ROUTES (native + tokens) */
/* ------------------------------------------------------------------ */

const { getNativePrices, getTokenPrices } = require('./coingeckoClient')

// GET /api/prices/native?chainIds=1,56,137
app.get('/api/prices/native', async (req, res) => {
  try {
    const idsParam = req.query.chainIds || ''
    const chainIds = idsParam
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))

    if (!chainIds.length) {
      return res.status(400).json({ error: 'chainIds query param required' })
    }

    const prices = await getNativePrices(chainIds)
    return res.json({ prices })
  } catch (e) {
    console.error('Native price error:', e)
    return res.status(500).json({ error: 'Failed to fetch native prices' })
  }
})

// POST /api/prices/tokens { chainId, addresses: [] }
app.post('/api/prices/tokens', async (req, res) => {
  try {
    const { chainId, addresses } = req.body || {}
    if (!chainId || !Array.isArray(addresses) || !addresses.length) {
      return res
        .status(400)
        .json({ error: 'chainId and non-empty addresses[] are required' })
    }

    const prices = await getTokenPrices(Number(chainId), addresses)
    return res.json({ prices })
  } catch (e) {
    console.error('Token price error:', e)
    return res.status(500).json({ error: 'Failed to fetch token prices' })
  }
})

/* ------------------------------------------------------------------ */
/* 2) BRIDGE ROUTES (quote / execute / status, in-memory tracking) */
/* ------------------------------------------------------------------ */

const { v4: uuid } = require('uuid')

// simple in-memory store (you can replace with Redis/DB later)
const bridgeJobs = new Map()

// POST /api/bridge/quote
app.post('/api/bridge/quote', async (req, res) => {
  try {
    const { fromChain, toChain, token, amount, recipient, env } = req.body || {}

    if (!fromChain || !toChain || !token || !amount || !recipient) {
      return res.status(400).json({
        error: 'fromChain, toChain, token, amount, recipient are required'
      })
    }

    // TODO: integrate real Wormhole route / quote logic here
    // For now we just fake a simple quote.
    const amt = Number(amount)
    const estimatedGasUsd = 3.5
    const fee = amt * 0.005 // 0.5% fee
    const output = amt - fee

    const quoteId = uuid()

    bridgeJobs.set(quoteId, {
      id: quoteId,
      type: 'quote',
      fromChain,
      toChain,
      token,
      amount,
      recipient,
      env: env || 'mainnet',
      routeName: 'hfv-demo-route',
      estimatedGasUsd,
      estimatedOutputAmount: String(output),
      createdAt: Date.now()
    })

    return res.json({
      estimatedGasUsd,
      estimatedOutputAmount: String(output),
      routeName: 'hfv-demo-route',
      feeBreakdown: {
        bridgeFeeUsd: fee * 0.02,
        relayerFeeUsd: fee * 0.08,
        dexSlippageUsd: fee * 0.9
      },
      quoteId
    })
  } catch (e) {
    console.error('Bridge quote error:', e)
    return res.status(500).json({ error: 'Failed to build bridge quote' })
  }
})

// POST /api/bridge/execute
app.post('/api/bridge/execute', async (req, res) => {
  try {
    const { fromChain, toChain, token, amount, recipient, quoteId, env } =
      req.body || {}

    if (!fromChain || !toChain || !token || !amount || !recipient) {
      return res.status(400).json({
        error: 'fromChain, toChain, token, amount, recipient are required'
      })
    }

    const trackingId = uuid()
    const now = Date.now()

    // Basic job record; in a real system you'd update this when tx confirms.
    bridgeJobs.set(trackingId, {
      id: trackingId,
      type: 'bridge',
      fromChain,
      toChain,
      token,
      amount,
      recipient,
      quoteId: quoteId || null,
      env: env || 'mainnet',
      status: 'pending',
      sourceTxHash: null,
      destTxHash: null,
      createdAt: now,
      updatedAt: now,
      errorMessage: null
    })

    return res.json({
      trackingId,
      sourceTxHash: null
    })
  } catch (e) {
    console.error('Bridge execute error:', e)
    return res.status(500).json({ error: 'Failed to start bridge job' })
  }
})

// GET /api/bridge/status?id=trackingId
app.get('/api/bridge/status', async (req, res) => {
  try {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'id query param is required' })
    }

    const job = bridgeJobs.get(id)
    if (!job) {
      return res.status(404).json({ error: 'Unknown trackingId' })
    }

    // For now we just return whatever status is in the job.
    // You can later wire a cron/worker to set status to 'completed' etc.
    return res.json({
      status: job.status || 'pending',
      fromChain: job.fromChain,
      toChain: job.toChain,
      sourceTxHash: job.sourceTxHash,
      destTxHash: job.destTxHash,
      errorMessage: job.errorMessage
    })
  } catch (e) {
    console.error('Bridge status error:', e)
    return res.status(500).json({ error: 'Failed to fetch bridge status' })
  }
})

/* ------------------------------------------------------------------ */
/* 3) START SERVER */
/* ------------------------------------------------------------------ */

app.listen(PORT, () => {
  console.log(`HFV API listening on http://localhost:${PORT}`)
})