import { CroppedAreaPixels } from '@/app/posts/create/steps/PostCreateCrop';

interface GetCroppedImgProps {
  imageSrc: string;
  pixelCrop: CroppedAreaPixels;
  userId: number;
  username: string;
  /** 0.0 ~ 1.0 (기본값 0.8) */
  quality?: number;
  /** 리사이즈할 최대 width (기본은 원본 크기 유지) */
  resizeWidth?: number;
}

const isClient = typeof window !== 'undefined';

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;

    image.onload = () => resolve(image);
    image.onerror = (error) => reject(new Error(`이미지 로드 실패: ${error}`));
  });
}

export async function getCroppedImgFile({
  imageSrc,
  pixelCrop,
  userId,
  username,
  quality = 0.8,
  resizeWidth,
}: GetCroppedImgProps): Promise<File> {
  if (!isClient) {
    throw new Error('Window is undefined. This function should run on the client.');
  }

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas Context를 가져올 수 없습니다.');
  }

  // 크롭된 영역 기준 리사이즈 비율 계산
  const originalWidth = pixelCrop.width;
  const originalHeight = pixelCrop.height;

  const targetWidth = resizeWidth && resizeWidth < originalWidth ? resizeWidth : originalWidth;
  const scale = targetWidth / originalWidth;
  const targetHeight = originalHeight * scale;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas Blob 생성 실패'));
          return;
        }

        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const file = new File([blob], `${userId}_${username}_cropped_${timestamp}.jpg`, {
          type: 'image/jpeg',
        });

        resolve(file);
      },
      'image/jpeg',
      quality,
    );
  });
}

export async function getImageAspectRatio(url: string): Promise<number> {
  if (!isClient) {
    throw new Error('Window is undefined. This function should run on the client.');
  }

  try {
    const image = await createImage(url);
    return image.width / image.height;
  } catch (error) {
    throw new Error(`이미지 비율 가져오기 실패: ${error}`);
  }
}

export async function resizeImageFile(
  file: File,
  options: { maxWidth: number; quality: number },
): Promise<File> {
  if (!isClient) {
    throw new Error('Window is undefined. This function should run on the client.');
  }

  const { maxWidth, quality } = options;

  const image = await createImage(URL.createObjectURL(file));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas Context를 가져올 수 없습니다.');
  }

  const ratio = maxWidth / image.width;
  const targetWidth = maxWidth;
  const targetHeight = image.height * ratio;

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Blob 생성 실패'));
        const resized = new File([blob], file.name, { type: 'image/jpeg' });
        resolve(resized);
      },
      'image/jpeg',
      quality,
    );
  });
}
