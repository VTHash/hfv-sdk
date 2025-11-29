const axios = require('axios')

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || ''

const cg = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
  headers: {
    'User-Agent': 'HFV-API/1.0'
  }
})

// attach API key header if provided
cg.interceptors.request.use((config) => {
  if (COINGECKO_API_KEY) {
    config.headers['x-cg-demo-api-key'] = COINGECKO_API_KEY
  }
  return config
})

// simple in-memory cache
const priceCache = new Map()
const CACHE_DURATION = 60_000 // 1 minute

function cacheKey(url, params) {
  return url + JSON.stringify(params || {})
}

function getFromCache(key) {
  const entry = priceCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    priceCache.delete(key)
    return null
  }
  return entry.data
}

// ------------ chain → CoinGecko ids for native + tokens ------------

// 38 chains native ids (what you provided)
const NATIVE_ID_BY_CHAIN = {
  1: 'ethereum', // ETH
  10: 'ethereum', // Optimism uses ETH
  56: 'binancecoin', // BNB
  100: 'xdai', // xDAI / Gnosis
  137: 'matic-network', // MATIC
  250: 'fantom', // FTM
  8453: 'ethereum', // Base uses ETH
  59144: 'ethereum', // Linea uses ETH
  34443: 'ethereum', // Mode uses ETH
  42161: 'ethereum', // Arbitrum uses ETH
  43114: 'avalanche-2', // AVAX
  1329: 'sei-network', // SEI
  1313161554: 'ethereum', // Aurora uses ETH
  42220: 'celo', // CELO
  1284: 'moonbeam', // GLMR
  1285: 'moonriver', // MOVR
  1666600000: 'harmony', // ONE
  170: 'ethereum', // Unichain uses ETH
  7777777: 'ethereum', // Zora uses ETH
  5000: 'mantle', // MNT
  14: 'flare-networks', // Flare
  40: 'telos', // TLOS
  50: 'xdce-crowd-sale', // XDC
  57: 'syscoin', // SYS
  61: 'ethereum-classic', // ETC
  57073: 'inkonchain',
  122: 'fuse', // FUSE
  60808: 'bob',
  81457: 'blast',
  1868: 'soneium',
  480: 'worldcoin', // World Chain
  1135: 'lisk',
  1923: 'swellchain',
  2741: 'abstract',
  747474: 'katana',
  146: 'sonic'
}

// platforms for ERC-20s (best-effort; some are placeholders)
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

// ----------- public functions used by your API routes -----------

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
  const cached = getFromCache(key)
  if (cached) return mapNativeResponse(chainIds, cached)

  const { data } = await cg.get('/simple/price', { params })
  priceCache.set(key, { data, timestamp: Date.now() })
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
  const params = {
    contract_addresses: contractAddrs,
    vs_currencies: 'usd'
  }
  const url = `/simple/token_price/${platform}`
  const key = cacheKey(url, params)
  const cached = getFromCache(key)
  if (cached) return cached

  const { data } = await cg.get(url, { params })
  priceCache.set(key, { data, timestamp: Date.now() })

  const out = {}
  for (const [addr, obj] of Object.entries(data || {})) {
    out[addr.toLowerCase()] = Number(obj.usd || 0)
  }
  return out
}

module.exports = {
  getNativePrices,
  getTokenPrices
}