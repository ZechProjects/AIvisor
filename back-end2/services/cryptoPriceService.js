const axios = require('axios');

class CryptoPriceService {
    constructor() {
        this.priceCache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
    }

    async getPriceInUSDT(crypto) {
        try {
            const cachedPrice = this.priceCache.get(crypto);
            if (cachedPrice && cachedPrice.timestamp > Date.now() - this.cacheTimeout) {
                return cachedPrice.price;
            }

            // Try CoinGecko first
            try {
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.toLowerCase()}&vs_currencies=usdt`
                );
                const price = response.data[crypto.toLowerCase()].usdt;
                this.priceCache.set(crypto, {
                    price,
                    timestamp: Date.now()
                });
                return price;
            } catch (error) {
                // Fallback to Binance API
                const response = await axios.get(
                    `https://api.binance.com/api/v3/ticker/price?symbol=${crypto}USDT`
                );
                const price = parseFloat(response.data.price);
                this.priceCache.set(crypto, {
                    price,
                    timestamp: Date.now()
                });
                return price;
            }
        } catch (error) {
            throw new Error(`Failed to fetch price for ${crypto}: ${error.message}`);
        }
    }
}

module.exports = new CryptoPriceService(); 