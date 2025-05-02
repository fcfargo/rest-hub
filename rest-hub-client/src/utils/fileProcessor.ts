import { resizeImageFile } from './imageUtils';

export type FileProcessResult =
  | {
      success: true;
      file: File;
      fileUrl: string;
      fileType: string;
    }
  | {
      success: false;
      errorMessage: string;
    };

/** 이미지 전용 파일 처리 */
export const processImageFile = async (file: File | null): Promise<FileProcessResult> => {
  if (typeof window === 'undefined') {
    return { success: false, errorMessage: '이 기능은 브라우저 환경에서만 사용할 수 있습니다.' };
  }

  if (!file) {
    return { success: false, errorMessage: '업로드할 파일이 없습니다.' };
  }

  const fileType = file.type.split('/')[0];
  if (fileType !== 'image') {
    return {
      success: false,
      errorMessage: '이미지 파일만 업로드할 수 있습니다.',
    };
  }

  // ✅ 이미지 리사이징 및 압축
  const resizedFile = await resizeImageFile(file, {
    maxWidth: 200,
    quality: 0.8,
  });

  const fileUrl = URL.createObjectURL(resizedFile);

  return { success: true, file: resizedFile, fileUrl, fileType };
};

/** 여러 타입 허용하는 범용 처리 */
export const processMediaFile = (
  file: File | null,
  allowedTypes: string[] = ['image', 'video'],
): FileProcessResult => {
  if (typeof window === 'undefined') {
    return { success: false, errorMessage: '이 기능은 브라우저 환경에서만 사용할 수 있습니다.' };
  }

  if (!file) {
    return { success: false, errorMessage: '업로드할 파일이 없습니다.' };
  }

  const fileType = file.type.split('/')[0];
  if (!allowedTypes.includes(fileType)) {
    return {
      success: false,
      errorMessage: `지원되지 않는 파일 형식입니다. 허용된 형식: (${allowedTypes.join(', ')})`,
    };
  }

  const fileUrl = URL.createObjectURL(file);

  return { success: true, file, fileUrl, fileType };
};
