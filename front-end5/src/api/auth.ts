import axios from './axiosConfig';
import { User } from './types';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  walletId: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  login: (data: LoginRequest) => {
    return axios.post<{ user: User; token: string }>('/auth/login', data);
  },

  logout: () => {
    return axios.post('/auth/logout');
  },

  requestPasswordReset: (email: string) => {
    return axios.post('/auth/reset-password-request', { email });
  },

  resetPassword: (token: string, newPassword: string, confirmPassword: string) => {
    return axios.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
  },

  register: (data: RegisterRequest) => {
    return axios.post<{ user: User; token: string }>('/auth/register', data);
  },

  changePassword: (data: ChangePasswordRequest) => {
    return axios.post('/auth/change-password', data);
  },
};
