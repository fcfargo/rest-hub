import axios from 'axios';

import { API_ENDPOINTS } from './api';
import api from './axiosInstance';
import { apiRequest } from '@/utils/apiRequest';
import { getAccessToken } from '@/utils/authUtils';

export async function uploadMediaToS3(file: File, logout: () => void): Promise<string> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    logout();
    throw new Error('Unauthorized: 로그인 필요');
  }

  try {
    const { data } = await apiRequest(async (accessToken: string) => {
      return api.get(API_ENDPOINTS.PRESIGNED_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { fileName: file.name, fileType: file.type },
      });
    }, logout);

    const presignedUrl = data.body;

    await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type },
    });

    return presignedUrl.split('?')[0];
  } catch (error) {
    console.error('S3 upload failed:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}
