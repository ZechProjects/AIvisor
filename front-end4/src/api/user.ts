import axios from './axiosConfig';

interface User {
  username: string;
}

export interface Portfolio {
  portfolio: Record<string, {
    quantity: number;
    averagePrice: number;
  }>;
  usdtBalance: number;
}

export const userService = {
  createUser: (userData: User) => {
    return axios.post('/users', userData);
  },

  getUser: (id: string) => {
    return axios.get(`/users/${id}`);
  },

  updateUser: (id: string, userData: Partial<User>) => {
    return axios.put(`/users/${id}`, userData);
  },

  deleteUser: (id: string) => {
    return axios.delete(`/users/${id}`);
  },

  getPortfolio: (id: string) => {
    return axios.get<Portfolio>(`/users/${id}/portfolio`);
  },
};
