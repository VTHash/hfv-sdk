const express = require('express')
const axios = require('axios')
const { COINGECKO_API_KEY, COINGECKO_BASE_URL } = require('./config')

const router = express.Router()

// simple axios client with CoinGecko config
const cg = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 15000,
  headers: {
    'User-Agent': 'HFV-Bridge-API/1.0'
  }
})

cg.interceptors.request.use((config) => {
  if (COINGECKO_API_KEY) {
    // demo / free tier header
    config.headers['x-cg-demo-api-key'] = COINGECKO_API_KEY
  }
  return config
})

// in-memory cache (per URL + params)
const cache = new Map()
const CACHE_MS = 60_000

function cacheKey(url, params) {
  return url + JSON.stringify(params || {})
}

function readCache(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_MS) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function writeCache(key, data) {
  cache.set(key, { data, ts: Date.now() })
}

// ---------- NATIVE PRICE MAPS FOR YOUR 38 CHAINS ----------

const NATIVE_ID_BY_CHAIN = {
  1: 'ethereum',
  10: 'ethereum',
  56: 'binancecoin',
  100: 'xdai',
  137: 'matic-network',
  250: 'fantom',
  8453: 'ethereum',
  59144: 'ethereum',
  34443: 'ethereum',
  42161: 'ethereum',
  43114: 'avalanche-2',
  1329: 'sei-network',
  1313161554: 'ethereum',
  42220: 'celo',
  1284: 'moonbeam',
  1285: 'moonriver',
  1666600000: 'harmony',
  170: 'ethereum',
  7777777: 'ethereum',
  5000: 'mantle',
  14: 'flare-networks',
  40: 'telos',
  50: 'xdce-crowd-sale',
  57: 'syscoin',
  61: 'ethereum-classic',
  57073: 'inkonchain',
  122: 'fuse',
  60808: 'bob',
  81457: 'blast',
  1868: 'soneium',
  480: 'worldcoin',
  1135: 'lisk',
  1923: 'swellchain',
  2741: 'abstract',
  747474: 'katana',
  146: 'sonic'
  // 80094: 'berachain' // later
}

// platform slugs for /simple/token_price/{platform}
const PLATFORM_BY_CHAIN = {
  1: 'ethereum',
  10: 'optimistic-ethereum',
  56: 'binance-smart-chain',
  100: 'xdai',
  137: 'polygon-pos',
  250: 'fantom',
  8453: 'base',
  59144: 'linea',
  34443: 'mode',
  42161: 'arbitrum-one',
  43114: 'avalanche',
  1329: 'sei-network',
  1313161554: 'aurora',
  42220: 'celo',
  1284: 'moonbeam',
  1285: 'moonriver',
  1666600000: 'harmony-shard-0',
  170: 'unichain',
  7777777: 'zora',
  5000: 'mantle',
  14: 'flare',
  40: 'telos',
  50: 'xdc',
  57: 'syscoin',
  61: 'ethereum-classic',
  57073: 'inkonchain',
  122: 'fuse',
  60808: 'bob',
  81457: 'blast',
  1868: 'soneium',
  480: 'worldchain',
  1135: 'lisk',
  1923: 'swellchain',
  2741: 'abstract',
  747474: 'katana',
  146: 'sonic'
}

// ------------ helpers ------------

async function getNativePrices(chainIds = []) {
  const ids = new Set()
  for (const cid of chainIds) {
    const coinId = NATIVE_ID_BY_CHAIN[cid]
    if (coinId) ids.add(coinId)
  }
  if (!ids.size) return {}

  const params = {
    ids: Array.from(ids).join(','),
    vs_currencies: 'usd'
  }
  const key = cacheKey('/simple/price', params)
  const cached = readCache(key)
  if (cached) return mapNativeResponse(chainIds, cached)

  const { data } = await cg.get('/simple/price', { params })
  writeCache(key, data)
  return mapNativeResponse(chainIds, data)
}

function mapNativeResponse(chainIds, data) {
  const out = {}
  for (const cid of chainIds) {
    const coinId = NATIVE_ID_BY_CHAIN[cid]
    const usd = coinId && data[coinId] ? data[coinId].usd : 0
    out[cid] = Number(usd || 0)
  }
  return out
}

async function getTokenPrices(chainId, addresses = []) {
  const platform = PLATFORM_BY_CHAIN[chainId]
  if (!platform || !addresses.length) return {}

  const contractAddrs = addresses.map((a) => a.toLowerCase()).join(',')
  const params = { contract_addresses: contractAddrs, vs_currencies: 'usd' }
  const url = `/simple/token_price/${platform}`

  const key = cacheKey(url, params)
  const cached = readCache(key)
  if (cached) return cached

  const { data } = await cg.get(url, { params })
  writeCache(key, data)

  const out = {}
  for (const [addr, obj] of Object.entries(data || {})) {
    out[addr.toLowerCase()] = Number(obj.usd || 0)
  }
  return out
}

// ------------ routes ------------

// GET /api/prices/native?chainIds=1,56,137
router.get('/native', async (req, res) => {
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
    console.error('Native price error:', e.message)
    res.status(500).json({ error: 'Failed to fetch native prices' })
  }
})

// POST /api/prices/tokens { chainId, addresses: [] }
router.post('/tokens', async (req, res) => {
  try {
    const { chainId, addresses } = req.body || {}
    if (!chainId || !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'chainId and addresses required' })
    }
    const prices = await getTokenPrices(Number(chainId), addresses)
    res.json({ prices })
  } catch (e) {
    console.error('Token price error:', e.message)
    res.status(500).json({ error: 'Failed to fetch token prices' })
  }
})

module.exports = router