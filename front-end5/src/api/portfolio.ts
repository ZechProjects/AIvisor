import axios from './axiosConfig';
import { Portfolio } from './types';

interface CreatePortfolioRequest {
    userId: string;
    crypto: string;
    amount: number;
}

interface PortfolioResponse {
    portfolio: Portfolio[];
    usdtBalance: number;
    totalValue: number;
}

export const portfolioService = {
    getPortfolios: (userId: string) => {
        return axios.get<PortfolioResponse>(`/portfolio/user/${userId}`);
    },

    createPortfolio: (data: CreatePortfolioRequest) => {
        return axios.post<Portfolio>('/portfolio', data);
    },

    updatePortfolio: (userId: string, crypto: string, amount: number) => {
        return axios.patch<Portfolio>(`/portfolio/${userId}/${crypto}`, { amount });
    },

    deletePortfolio: (userId: string, crypto: string) => {
        return axios.delete(`/portfolio/${userId}/${crypto}`);
    }
}; 