'use client';

import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import { PostDataProps } from '../postCreateModal';

import { ErrorMessage } from '@/components/ui/message';
import { INPUT_TYPES } from '@/constants';
import cropStyles from '@/styles/posts/postCreateCrop.module.css';
import modalStyles from '@/styles/posts/postCreateModal.module.css';
import { getCroppedImg } from '@/utils/imageUtils';

interface PostCreateCropProps {
  nextStep: () => void;
  prevStep: () => void;
  setPostData: Dispatch<SetStateAction<PostDataProps>>;
  fileUrl: string;
}

type Crop = {
  x: number;
  y: number;
};

type CroppedAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export default function PostCreateCrop({
  nextStep,
  prevStep,
  setPostData,
  fileUrl,
}: PostCreateCropProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const onCropComplete = useCallback((_, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    setMessage(null);

    if (!croppedAreaPixels) {
      setMessage('게시물 편집을 완료해야 다음 단계로 이동할 수 있습니다.');
      return;
    }

    try {
      const croppedImage = await getCroppedImg(fileUrl, croppedAreaPixels);
      setPostData((prev: PostDataProps) => ({ ...prev, fileUrl: croppedImage }));

      nextStep();
    } catch (error) {
      console.error('Handle crop failed:', error);
      setMessage('게시물 편집 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className={modalStyles.wrapper}>
      {/* 헤더 */}
      <div className={modalStyles.header}>
        <button onClick={prevStep} className={cropStyles.backButton}>
          뒤로
        </button>
        <h2 className={modalStyles.title}>게시물 자르기</h2>
        <button onClick={handleCropDone} className={cropStyles.doneButton}>
          다음
        </button>
      </div>

      {/* 크롭 컨테이너 */}
      <div className={cropStyles.cropContainer}>
        <Cropper
          image={fileUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* 에러 메시지 출력 */}
      {message && <ErrorMessage message={message} />}

      {/* 줌 컨트롤 */}
      <div className={cropStyles.zoomContainer}>
        <input
          className={cropStyles.zoom}
          type={INPUT_TYPES.RANGE}
          min="1"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
