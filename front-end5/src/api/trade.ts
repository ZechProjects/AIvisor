import axios from './axiosConfig';
import { Trade } from './types';

interface CreateTradeRequest {
    userId: string;
    crypto: string;
    type: 'BUY' | 'SELL';
    amount: number;
    price: number;
}

export const tradeService = {
    createTrade: (data: CreateTradeRequest) => {
        return axios.post<Trade>('/trades', data);
    },

    updateAvsVerified: (tradeId: string, avsVerified: string) => {
        return axios.patch(`/trades/${tradeId}/verify`, { avsVerified });
    },

    getUserTrades: (userId: string) => {
        return axios.get<Trade[]>(`/trades/user/${userId}`);
    },

    getTradesByTimeRange: (startTime: Date, endTime: Date) => {
        return axios.get<Trade[]>('/trades/timerange', {
            params: {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            }
        });
    },

    getTradeById: (tradeId: string) => {
        return axios.get<Trade>(`/trades/${tradeId}`);
    }
};
