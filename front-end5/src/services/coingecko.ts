import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export const coingeckoService = {
  getPrice: async (cryptoId: string) => {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: cryptoId,
        vs_currencies: 'usd',
      },
    });
    return response.data;
  },

  getPriceHistory: async (cryptoIds: string[]) => {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: cryptoIds.join(','),
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return response.data as CryptoPrice[];
  },
}; 