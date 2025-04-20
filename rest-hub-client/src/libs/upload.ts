import axios from 'axios';

import { API_ENDPOINTS } from './api';
import api from './axiosInstance';

import { UPLOAD_OBJECT_TYPES } from '@/constants';
import { apiRequest } from '@/utils/apiRequest';
import { getAccessToken } from '@/utils/authUtils';

type UploadObjectType = (typeof UPLOAD_OBJECT_TYPES)[keyof typeof UPLOAD_OBJECT_TYPES];

interface UploadMediaToS3Props {
  file: File;
  logout: () => void;
  objectType: UploadObjectType;
  fileName?: string; // 사용자 정의 파일명
}

export async function uploadMediaToS3({
  file,
  logout,
  objectType,
  fileName,
}: UploadMediaToS3Props): Promise<string> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    logout();
    throw new Error('Unauthorized: 로그인 필요');
  }

  try {
    const { data } = await apiRequest(async (accessToken: string) => {
      return api.get(API_ENDPOINTS.PRESIGNED_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { fileName: fileName || file.name, fileType: file.type, objectType },
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
