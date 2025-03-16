import { HTTP_STATUS_CODES } from '@/constants';
import { getAccessToken, refreshAccessToken } from '@/utils/authUtils';

export async function apiRequest<T>(
  requestFn: (accessToken: string) => Promise<T>,
  logout: () => void,
): Promise<T> {
  let accessToken = getAccessToken();

  if (!accessToken) {
    console.warn('AccessToken이 없음, RefreshToken 확인...');
    try {
      accessToken = await refreshAccessToken();
      console.log('AccessToken 갱신 성공');
    } catch (error) {
      console.error('RefreshToken 갱신 실패:', error);
      logout();
      throw new Error('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  try {
    return await requestFn(accessToken);
  } catch (error) {
    if (error.response?.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      try {
        console.warn('AccessToken이 만료됨, RefreshToken으로 갱신 시도...');
        const newAccessToken = await refreshAccessToken();

        console.log('AccessToken 갱신 성공, API 요청 재시도...');
        return await requestFn(newAccessToken);
      } catch (refreshError) {
        console.error('RefreshToken 갱신 실패:', refreshError);
        logout();
        throw new Error('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
      }
    }

    throw error;
  }
}
