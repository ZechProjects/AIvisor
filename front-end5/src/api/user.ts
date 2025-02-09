import axios from './axiosConfig';
import { User, Portfolio } from './types';

export const userService = {
    getUserDetails: (userId: string) => {
        return axios.get<User>(`/users/${userId}`);
    },

    getUserPortfolio: (userId: string) => {
        return axios.get<Portfolio[]>(`/users/${userId}/portfolio`);
    },

    updateWalletId: (userId: string, walletId: string) => {
        return axios.patch(`/users/${userId}/wallet`, { walletId });
    },

    updateUsdtBalance: (userId: string, usdtBalance: number) => {
        return axios.patch(`/users/${userId}/balance`, { usdtBalance });
    },

    resetGame: (userId: string) => {
        return axios.post(`/users/${userId}/reset`);
    },

    getTopUsers: (limit: number = 10) => {
        return axios.get<{
            userId: string;
            email: string;
            totalValue: number;
            usdtBalance: number;
            portfolios: Portfolio[];
        }[]>(`/users/top/${limit}`);
    }
};
