export interface ChainMetadata {
  chainId: number
  key: string
  name: string
  symbol: string
  nativeCoingeckoId: string
  logo?: string
  supportedByWormhole: boolean
  wormholeChain?: string // Wormhole chain name if supported
}

/**
 * Includes ALL chains from your NATIVE_ID_BY_CHAIN mapping,
 * plus optional Wormhole metadata where applicable.
 */
export const SUPPORTED_CHAINS: ChainMetadata[] = [
  {
    chainId: 1,
    key: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/ethereum.png',
    supportedByWormhole: true,
    wormholeChain: 'Ethereum'
  },
  {
    chainId: 10,
    key: 'optimism',
    name: 'Optimism',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/optimism.png',
    supportedByWormhole: true,
    wormholeChain: 'Optimism'
  },
  {
    chainId: 56,
    key: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    nativeCoingeckoId: 'binancecoin',
    logo: '/logos/chains/bsc.png',
    supportedByWormhole: true,
    wormholeChain: 'BNB Chain'
  },
  {
    chainId: 100,
    key: 'gnosis',
    name: 'Gnosis',
    symbol: 'xDAI',
    nativeCoingeckoId: 'xdai',
    logo: '/logos/chains/gnosis.png',
    supportedByWormhole: false
  },
  {
    chainId: 137,
    key: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    nativeCoingeckoId: 'matic-network',
    logo: '/logos/chains/polygon.png',
    supportedByWormhole: true,
    wormholeChain: 'Polygon'
  },
  {
    chainId: 250,
    key: 'fantom',
    name: 'Fantom',
    symbol: 'FTM',
    nativeCoingeckoId: 'fantom',
    logo: '/logos/chains/fantom.png',
    supportedByWormhole: true,
    wormholeChain: 'Fantom'
  },
  {
    chainId: 8453,
    key: 'base',
    name: 'Base',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/base.png',
    supportedByWormhole: true,
    wormholeChain: 'Base'
  },
  {
    chainId: 59144,
    key: 'linea',
    name: 'Linea',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/linea.png',
    supportedByWormhole: false
  },
  {
    chainId: 34443,
    key: 'mode',
    name: 'Mode',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/mode.png',
    supportedByWormhole: false
  },
  {
    chainId: 42161,
    key: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/arbitrum.png',
    supportedByWormhole: true,
    wormholeChain: 'Arbitrum'
  },
  {
    chainId: 43114,
    key: 'avalanche',
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    nativeCoingeckoId: 'avalanche-2',
    logo: '/logos/chains/avalanche.png',
    supportedByWormhole: true,
    wormholeChain: 'Avalanche'
  },
  {
    chainId: 1329,
    key: 'sei',
    name: 'Sei',
    symbol: 'SEI',
    nativeCoingeckoId: 'sei-network',
    logo: '/logos/chains/sei.png',
    supportedByWormhole: true,
    wormholeChain: 'Sei'
  },
  {
    chainId: 1313161554,
    key: 'aurora',
    name: 'Aurora',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/aurora.png',
    supportedByWormhole: true,
    wormholeChain: 'Aurora'
  },
  {
    chainId: 42220,
    key: 'celo',
    name: 'Celo',
    symbol: 'CELO',
    nativeCoingeckoId: 'celo',
    logo: '/logos/chains/celo.png',
    supportedByWormhole: true,
    wormholeChain: 'Celo'
  },
  {
    chainId: 1284,
    key: 'moonbeam',
    name: 'Moonbeam',
    symbol: 'GLMR',
    nativeCoingeckoId: 'moonbeam',
    logo: '/logos/chains/moonbeam.png',
    supportedByWormhole: true,
    wormholeChain: 'Moonbeam'
  },
  {
    chainId: 1285,
    key: 'moonriver',
    name: 'Moonriver',
    symbol: 'MOVR',
    nativeCoingeckoId: 'moonriver',
    logo: '/logos/chains/moonriver.png',
    supportedByWormhole: false
  },
  {
    chainId: 1666600000,
    key: 'harmony',
    name: 'Harmony',
    symbol: 'ONE',
    nativeCoingeckoId: 'harmony',
    logo: '/logos/chains/harmony.png',
    supportedByWormhole: false
  },
  {
    chainId: 170,
    key: 'unichain',
    name: 'Unichain',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/unichain.png',
    supportedByWormhole: false
  },
  {
    chainId: 7777777,
    key: 'zora',
    name: 'Zora',
    symbol: 'ETH',
    nativeCoingeckoId: 'ethereum',
    logo: '/logos/chains/zora.png',
    supportedByWormhole: false
  },
  {
    chainId: 5000,
    key: 'mantle',
    name: 'Mantle',
    symbol: 'MNT',
    nativeCoingeckoId: 'mantle',
    logo: '/logos/chains/mantle.png',
    supportedByWormhole: true,
    wormholeChain: 'Mantle'
  },
  {
    chainId: 14,
    key: 'flare',
    name: 'Flare',
    symbol: 'FLR',
    nativeCoingeckoId: 'flare-networks',
    logo: '/logos/chains/flare.png',
    supportedByWormhole: false
  },
  {
    chainId: 40,
    key: 'telos',
    name: 'Telos',
    symbol: 'TLOS',
    nativeCoingeckoId: 'telos',
    logo: '/logos/chains/telos.png',
    supportedByWormhole: false
  },
  {
    chainId: 50,
    key: 'xdc',
    name: 'XDC Network',
    symbol: 'XDC',
    nativeCoingeckoId: 'xdce-crowd-sale',
    logo: '/logos/chains/xdc.png',
    supportedByWormhole: false
  },
  {
    chainId: 57,
    key: 'syscoin',
    name: 'Syscoin',
    symbol: 'SYS',
    nativeCoingeckoId: 'syscoin',
    logo: '/logos/chains/syscoin.png',
    supportedByWormhole: false
  },
  {
    chainId: 61,
    key: 'etc',
    name: 'Ethereum Classic',
    symbol: 'ETC',
    nativeCoingeckoId: 'ethereum-classic',
    logo: '/logos/chains/etc.png',
    supportedByWormhole: false
  },
  {
    chainId: 57073,
    key: 'ink',
    name: 'Inkonchain',
    symbol: 'INK',
    nativeCoingeckoId: 'inkonchain',
    logo: '/logos/chains/ink.png',
    supportedByWormhole: false
  },
  {
    chainId: 122,
    key: 'fuse',
    name: 'Fuse',
    symbol: 'FUSE',
    nativeCoingeckoId: 'fuse',
    logo: '/logos/chains/fuse.png',
    supportedByWormhole: false
  },
  {
    chainId: 60808,
    key: 'bob',
    name: 'BOB',
    symbol: 'BOB',
    nativeCoingeckoId: 'bob',
    logo: '/logos/chains/bob.png',
    supportedByWormhole: false
  },
  {
    chainId: 81457,
    key: 'blast',
    name: 'Blast',
    symbol: 'ETH',
    nativeCoingeckoId: 'blast',
    logo: '/logos/chains/blast.png',
    supportedByWormhole: true,
    wormholeChain: 'Blast'
  },
  {
    chainId: 1868,
    key: 'soneium',
    name: 'Soneium',
    symbol: 'ETH',
    nativeCoingeckoId: 'soneium',
    logo: '/logos/chains/soneium.png',
    supportedByWormhole: false
  },
  {
    chainId: 480,
    key: 'worldchain',
    name: 'World Chain',
    symbol: 'WLD',
    nativeCoingeckoId: 'worldcoin',
    logo: '/logos/chains/worldchain.png',
    supportedByWormhole: true,
    wormholeChain: 'World Chain'
  },
  {
    chainId: 1135,
    key: 'lisk',
    name: 'Lisk',
    symbol: 'LSK',
    nativeCoingeckoId: 'lisk',
    logo: '/logos/chains/lisk.png',
    supportedByWormhole: false
  },
  {
    chainId: 1923,
    key: 'swellchain',
    name: 'Swellchain',
    symbol: 'SWELL',
    nativeCoingeckoId: 'swellchain',
    logo: '/logos/chains/swellchain.png',
    supportedByWormhole: false
  },
  {
    chainId: 2741,
    key: 'abstract',
    name: 'Abstract',
    symbol: 'ABST',
    nativeCoingeckoId: 'abstract',
    logo: '/logos/chains/abstract.png',
    supportedByWormhole: false
  },
  {
    chainId: 747474,
    key: 'katana',
    name: 'Katana',
    symbol: 'KATA',
    nativeCoingeckoId: 'katana',
    logo: '/logos/chains/katana.png',
    supportedByWormhole: false
  },
  {
    chainId: 146,
    key: 'sonic',
    name: 'Sonic',
    symbol: 'S',
    nativeCoingeckoId: 'sonic',
    logo: '/logos/chains/sonic.png',
    supportedByWormhole: false
  }
]