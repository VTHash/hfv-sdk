require('dotenv').config()

const PORT = process.env.PORT || 4000
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || ''

// base URL for CoinGecko free/demo API
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

module.exports = {
  PORT,
  COINGECKO_API_KEY,
  COINGECKO_BASE_URL
}