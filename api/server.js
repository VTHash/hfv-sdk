require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')

const { getNativePrices, getTokenPrices } = require('./coingeckoClient')
const { createQuote, createJobFromQuote, getJob } = require('./bridgeStore')

const app = express()
app.use(cors())
app.use(express.json())

// ---- Prices API ----

// GET /api/prices/native?chainIds=1,56,137
app.get('/api/prices/native', async (req, res) => {
  try {
    const idsParam = req.query.chainIds || ''
    const chainIds = idsParam
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))

    const prices = await getNativePrices(chainIds)
    res.json({ prices })
  } catch (e) {
    console.error('Native price error:', e)
    res.status(500).json({ error: 'Failed to fetch native prices' })
  }
})

// POST /api/prices/tokens { chainId, addresses: [] }
app.post('/api/prices/tokens', async (req, res) => {
  try {
    const { chainId, addresses } = req.body || {}
    if (!chainId || !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'chainId and addresses required' })
    }
    const prices = await getTokenPrices(Number(chainId), addresses)
    res.json({ prices })
  } catch (e) {
    console.error('Token price error:', e)
    res.status(500).json({ error: 'Failed to fetch token prices' })
  }
})

// ---- Token registry (reads from your generated per-chain JSON) ----

// GET /api/tokens/:chainKey e.g. /api/tokens/ethereum
app.get('/api/tokens/:chainKey', (req, res) => {
  try {
    const chainKey = req.params.chainKey
    const filePath = path.join(__dirname, '..', 'src', 'tokens', `${chainKey}.json`)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Unknown chain key' })
    }

    const raw = fs.readFileSync(filePath, 'utf8')
    const tokens = JSON.parse(raw)
    res.json({ tokens })
  } catch (e) {
    console.error('Token registry error:', e)
    res.status(500).json({ error: 'Failed to load tokens' })
  }
})

// ---- Bridge API (quote / execute / status) ----

// POST /api/bridge/quote
app.post('/api/bridge/quote', async (req, res) => {
  try {
    const { fromChain, toChain, token, amount, recipient } = req.body || {}

    if (!fromChain || !toChain || !token || !amount || !recipient) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // TODO: plug in real Wormhole pricing here.
    const amt = Number(amount)
    const estimatedGasUsd = 3.5
    const fee = amt * 0.005 // 0.5% fee
    const output = amt - fee

    const quote = createQuote(
      { fromChain, toChain, token, amount, recipient },
      {
        routeName: 'hfv-wormhole-demo',
        estimatedGasUsd,
        estimatedOutputAmount: String(output),
        feeBreakdown: {
          bridgeFeeUsd: fee * 0.2,
          relayerFeeUsd: fee * 0.3,
          dexSlippageUsd: fee * 0.5
        }
      }
    )

    res.json({
      estimatedGasUsd: quote.estimatedGasUsd,
      estimatedOutputAmount: quote.estimatedOutputAmount,
      routeName: quote.routeName,
      feeBreakdown: quote.feeBreakdown,
      quoteId: quote.id
    })
  } catch (e) {
    console.error('Bridge quote error:', e)
    res.status(500).json({ error: 'Failed to build bridge quote' })
  }
})

// POST /api/bridge/execute
app.post('/api/bridge/execute', async (req, res) => {
  try {
    const { fromChain, toChain, token, amount, recipient, quoteId } = req.body || {}

    if (!fromChain || !toChain || !token || !amount || !recipient) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const job = createJobFromQuote(
      { fromChain, toChain, token, amount, recipient },
      quoteId || null
    )

    // TODO: integrate real Wormhole execution / tracking here.

    res.json({
      trackingId: job.id,
      sourceTxHash: job.sourceTxHash
    })
  } catch (e) {
    console.error('Bridge execute error:', e)
    res.status(500).json({ error: 'Failed to execute bridge' })
  }
})

// GET /api/bridge/status?id=...
app.get('/api/bridge/status', (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })

    const job = getJob(id)
    if (!job) return res.status(404).json({ error: 'Unknown trackingId' })

    res.json({
      status: job.status,
      fromChain: job.fromChain,
      toChain: job.toChain,
      sourceTxHash: job.sourceTxHash,
      destTxHash: job.destTxHash,
      errorMessage: job.errorMessage
    })
  } catch (e) {
    console.error('Bridge status error:', e)
    res.status(500).json({ error: 'Failed to fetch bridge status' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`HFV API running on http://localhost:${PORT}`)
})