import axios from './axiosConfig';

interface TradeRequest {
  userId: string;
  crypto: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
}

interface TradeResponse {
  message: string;
  trade: TradeRequest;
}

export const tradeService = {
  executeTrade: (tradeData: TradeRequest) => {
    return axios.post<TradeResponse>('/trade', tradeData);
  },
};
