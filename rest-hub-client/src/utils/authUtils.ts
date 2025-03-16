import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export async function refreshAccessToken(): Promise<string> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data } = await api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.body;

    saveTokens(newAccessToken, newRefreshToken);
    return newAccessToken;
  } catch (error) {
    console.error('Refresh token failed:', error);
    throw new Error('Failed to refresh access token');
  }
}
