const axios = require('axios');
const cryptoPriceService = require('../../services/cryptoPriceService');

// Mock axios
jest.mock('axios');

describe('CryptoPriceService', () => {
    beforeEach(() => {
        // Clear cache before each test
        cryptoPriceService.priceCache.clear();
        jest.clearAllMocks();
    });

    describe('getPriceInUSDT', () => {
        it('should fetch price from CoinGecko successfully', async () => {
            const mockPrice = 50000;
            axios.get.mockResolvedValueOnce({
                data: {
                    bitcoin: {
                        usdt: mockPrice
                    }
                }
            });

            const price = await cryptoPriceService.getPriceInUSDT('bitcoin');
            expect(price).toBe(mockPrice);
            expect(axios.get).toHaveBeenCalledWith(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usdt'
            );
        });

        it('should fallback to Binance API when CoinGecko fails', async () => {
            const mockPrice = '50000';
            // Mock CoinGecko failure
            axios.get.mockRejectedValueOnce(new Error('CoinGecko error'));
            // Mock Binance success
            axios.get.mockResolvedValueOnce({
                data: {
                    price: mockPrice
                }
            });

            const price = await cryptoPriceService.getPriceInUSDT('BTC');
            expect(price).toBe(parseFloat(mockPrice));
            expect(axios.get).toHaveBeenCalledWith(
                'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
            );
        });

        it('should use cached price if available and not expired', async () => {
            const mockPrice = 50000;
            cryptoPriceService.priceCache.set('bitcoin', {
                price: mockPrice,
                timestamp: Date.now()
            });

            const price = await cryptoPriceService.getPriceInUSDT('bitcoin');
            expect(price).toBe(mockPrice);
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should throw error if both APIs fail', async () => {
            axios.get.mockRejectedValueOnce(new Error('CoinGecko error'));
            axios.get.mockRejectedValueOnce(new Error('Binance error'));

            await expect(cryptoPriceService.getPriceInUSDT('bitcoin'))
                .rejects
                .toThrow('Failed to fetch price for bitcoin');
        });

        it('should refresh expired cache', async () => {
            const oldPrice = 50000;
            const newPrice = 51000;
            
            // Set expired cache
            cryptoPriceService.priceCache.set('bitcoin', {
                price: oldPrice,
                timestamp: Date.now() - (cryptoPriceService.cacheTimeout + 1000)
            });

            axios.get.mockResolvedValueOnce({
                data: {
                    bitcoin: {
                        usdt: newPrice
                    }
                }
            });

            const price = await cryptoPriceService.getPriceInUSDT('bitcoin');
            expect(price).toBe(newPrice);
            expect(axios.get).toHaveBeenCalled();
        });
    });
}); 