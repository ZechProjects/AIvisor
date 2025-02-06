import axios from './axiosConfig';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId: string;
}

interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginRequest) => {
    return axios.post<LoginResponse>('/login', credentials);
  },

  logout: () => {
    return axios.post('/logout');
  },

  requestPasswordReset: (username: string) => {
    return axios.post('/request-reset', { username });
  },

  resetPassword: (data: ResetPasswordRequest) => {
    return axios.post('/reset-password', data);
  },

  register: (userData: RegisterRequest) => {
    return axios.post<LoginResponse>('/register', userData);
  },
};
