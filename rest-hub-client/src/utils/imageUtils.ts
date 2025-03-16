import { CroppedAreaPixels } from '@/app/posts/create/steps/PostCreateCrop';

interface GetCroppedImgProps {
  imageSrc: string;
  pixelCrop: CroppedAreaPixels;
  userId: number;
  username: string;
}

const isClient = typeof window !== 'undefined';

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!isClient) {
      throw new Error('Window is undefined. This function should run on the client.');
    }

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

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas Blob 생성 실패'));
        return;
      }

      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ''); // 20240314153045 형식
      const file = new File([blob], `${userId}_${username}_cropped_${timestamp}.jpg`, {
        type: 'image/jpeg',
      });

      resolve(file);
    }, 'image/jpeg');
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
