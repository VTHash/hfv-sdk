const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const INPUT = path.join(ROOT, 'src', 'tokens', 'tokens-allchains.json')
const OUTPUT_DIR = path.join(ROOT, 'src', 'tokens')

// ---- 38 chains you care about (chainId + file key) ----
const TARGET_CHAINS = [
  { chainId: 1, key: 'ethereum' },
  { chainId: 10, key: 'optimism' },
  { chainId: 56, key: 'bsc' },
  { chainId: 100, key: 'gnosis' },
  { chainId: 137, key: 'polygon' },
  { chainId: 250, key: 'fantom' },
  { chainId: 8453, key: 'base' },
  { chainId: 59144, key: 'linea' },
  { chainId: 34443, key: 'mode' },
  { chainId: 42161, key: 'arbitrum' },
  { chainId: 43114, key: 'avalanche' },
  { chainId: 1329, key: 'sei' },
  { chainId: 1313161554, key: 'aurora' },
  { chainId: 42220, key: 'celo' },
  { chainId: 1284, key: 'moonbeam' },
  { chainId: 1285, key: 'moonriver' },
  { chainId: 1666600000, key: 'harmony' },
  { chainId: 170, key: 'unichain' },
  { chainId: 7777777, key: 'zora' },
  { chainId: 5000, key: 'mantle' },
  { chainId: 14, key: 'flare' },
  { chainId: 40, key: 'telos' },
  { chainId: 50, key: 'xdc' },
  { chainId: 57, key: 'syscoin' },
  { chainId: 61, key: 'ethereum-classic' },
  { chainId: 57073, key: 'inkonchain' },
  { chainId: 122, key: 'fuse' },
  { chainId: 60808, key: 'bob' },
  { chainId: 81457, key: 'blast' },
  { chainId: 1868, key: 'soneium' },
  { chainId: 480, key: 'worldcoin' }, // your file is worldcoin.json
  { chainId: 1135, key: 'lisk' },
  { chainId: 1923, key: 'swellchain' },
  { chainId: 2741, key: 'abstract' },
  { chainId: 747474, key: 'katana' },
  { chainId: 146, key: 'sonic' },

  // extras you already have in repo (optional, won’t hurt)
  { chainId: 8217, key: 'klaytn' }, // if present in LI.FI list
  { chainId: 324, key: 'zksync' } // if present
]

// ---- native symbols per chain (for wrapped/native detection) ----
const NATIVE_SYMBOLS_BY_CHAIN = {
  1: ['ETH', 'WETH'],
  10: ['ETH', 'WETH'],
  56: ['BNB', 'WBNB'],
  100: ['XDAI', 'WXDAI'],
  137: ['MATIC', 'WMATIC'],
  250: ['FTM', 'WFTM'],
  8453: ['ETH', 'WETH'],
  59144: ['ETH', 'WETH'],
  34443: ['ETH', 'WETH'],
  42161: ['ETH', 'WETH'],
  43114: ['AVAX', 'WAVAX'],
  1329: ['SEI'],
  1313161554: ['ETH', 'WETH'],
  42220: ['CELO', 'WCELO'],
  1284: ['GLMR', 'WGLMR'],
  1285: ['MOVR', 'WMOVR'],
  1666600000: ['ONE', 'WONE'],
  170: ['ETH', 'WETH'],
  7777777: ['ETH', 'WETH'],
  5000: ['MNT', 'WMNT'],
  14: ['FLR'],
  40: ['TLOS', 'WTLOS'],
  50: ['XDC', 'WXDC'],
  57: ['SYS', 'WSYS'],
  61: ['ETC', 'WETC'],
  57073: ['INK'],
  122: ['FUSE', 'WFUSE'],
  60808: ['BOB'],
  81457: ['ETH', 'WETH'],
  1868: ['ETH', 'WETH'],
  480: ['WLD'],
  1135: ['LSK'],
  1923: ['SWELL'],
  2741: ['ABST'],
  747474: ['KATA'],
  146: ['S'], // Sonic
  8217: ['KLAY', 'WKLAY'],
  324: ['ETH', 'WETH']
}

// ---- global stablecoins we care about ----
const STABLE_SYMBOLS = new Set([
  'USDC',
  'USDC.E',
  'USDT',
  'USDT.E',
  'DAI',
  'BUSD',
  'TUSD',
  'FRAX',
  'USDD'
])

function loadAllTokens() {
  const raw = fs.readFileSync(INPUT, 'utf8')
  const data = JSON.parse(raw)

  // data can be an object { chainKey: Token[] }
  // or already a flat array; we normalize to ONE array
  if (Array.isArray(data)) return data

  const result = []
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) result.push(...value)
  }
  return result
}

function isWantedToken(token, chainId) {
  const sym = (token.symbol || '').toUpperCase()
  if (!sym) return false

  const natives = NATIVE_SYMBOLS_BY_CHAIN[chainId] || []

  // native or wrapped native by symbol
  if (natives.includes(sym)) return true
  if (sym.startsWith('W') && natives.includes(sym.slice(1))) return true

  // major stables
  if (STABLE_SYMBOLS.has(sym)) return true

  return false
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Input file not found: ${INPUT}`)
    process.exit(1)
  }

  const allTokens = loadAllTokens()
  console.log(`Loaded ${allTokens.length} tokens from tokens-allchains.json`)

  for (const chain of TARGET_CHAINS) {
    const chainTokens = allTokens.filter(
      (t) => t.chainId === chain.chainId && isWantedToken(t, chain.chainId)
    )

    const minimal = chainTokens.map((t) => ({
      address: t.address,
      symbol: t.symbol,
      name: t.name,
      decimals: t.decimals,
      chainId: t.chainId,
      coinKey: t.coinKey,
      logoURI: t.logoURI
    }))

    const outPath = path.join(OUTPUT_DIR, `${chain.key}.json`)
    fs.writeFileSync(outPath, JSON.stringify(minimal, null, 2))
    console.log(
      `Wrote ${minimal.length.toString().padStart(2, ' ')} tokens -> ${path.basename(outPath)}`
    )
  }

  console.log('Done.')
}

main()