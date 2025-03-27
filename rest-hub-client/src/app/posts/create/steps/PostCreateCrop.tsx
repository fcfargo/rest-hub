'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import MediaCrop from '@/components/media/mediaCrop';
import { ErrorMessage } from '@/components/ui/message';
import { ASPECT_RATIO_VALUES, INPUT_TYPES } from '@/constants';
import cropStyles from '@/styles/posts/postCreateCrop.module.css';
import { PostDataProps } from '@/types';
import { getCroppedImgFile, getImageAspectRatio } from '@/utils/imageUtils';

interface PostCreateCropProps {
  nextStep: () => void;
  prevStep: () => void;
  setPostData: Dispatch<SetStateAction<PostDataProps>>;
  fileUrl: string;
  userId: number;
  username: string;
}

type AspectRatioValueTypes = (typeof ASPECT_RATIO_VALUES)[keyof typeof ASPECT_RATIO_VALUES];

interface ControlsProps {
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}

interface AspectRatioMenu {
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  handleAspectRatioChange: (value: AspectRatioValueTypes) => void;
}

export type Crop = {
  x: number;
  y: number;
};

export type CroppedAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const ASPECT_RATIOS = [
  { label: '원본', value: ASPECT_RATIO_VALUES.ORIGINAL },
  { label: '1:1', value: ASPECT_RATIO_VALUES.SQUARE },
  { label: '4:5', value: ASPECT_RATIO_VALUES.LANDSCAPE_4_5 },
  { label: '16:9', value: ASPECT_RATIO_VALUES.LANDSCAPE_16_9 },
];

export default function PostCreateCrop({
  nextStep,
  prevStep,
  setPostData,
  fileUrl,
  userId,
  username,
}: PostCreateCropProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: CroppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels),
    [],
  );

  const handleCropDone = async () => {
    if (!croppedAreaPixels) {
      setMessage('게시물 편집을 완료해야 다음 단계로 이동할 수 있습니다.');
      return;
    }

    try {
      const croppedFile = await getCroppedImgFile({
        imageSrc: fileUrl,
        pixelCrop: croppedAreaPixels,
        userId,
        username,
      });

      const croppedUrl = URL.createObjectURL(croppedFile);

      setPostData((prev: PostDataProps) => ({
        ...prev,
        croppedFile,
        croppedUrl,
      }));
      nextStep();
    } catch (error) {
      console.error('Handle crop failed:', error);
      setMessage('게시물 편집 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleAspectRatioChange = async (value: AspectRatioValueTypes) => {
    if (value === ASPECT_RATIO_VALUES.ORIGINAL) {
      const originalAspect = await getImageAspectRatio(fileUrl);
      setAspectRatio(originalAspect);
    } else {
      setAspectRatio(value);
    }

    setIsDropdownOpen(false);
  };

  return (
    <div className={cropStyles.wrapper}>
      {/* 헤더 */}
      <div className={cropStyles.header}>
        <button onClick={prevStep} className={cropStyles.backButton}>
          <Image
            className={cropStyles.backButtonIcon}
            src="/posts/arrow-back.svg"
            alt="Back Button Icon"
            width={24}
            height={24}
          />
        </button>
        <h2 className={cropStyles.title}>게시물 자르기</h2>
        <button onClick={handleCropDone} className={cropStyles.doneButton}>
          다음
        </button>
      </div>

      {/* 크롭 컨테이너 */}
      <MediaCrop
        fileUrl={fileUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        setCrop={setCrop}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
      />

      {/* 에러 메시지 출력 */}
      {message && <ErrorMessage message={message} />}

      <div className={cropStyles.controlsContainer}>
        {/* 크롭 비율 컨트롤 */}
        <AspectRatioControls
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleAspectRatioChange={handleAspectRatioChange}
        />

        {/* 줌 컨트롤 */}
        <ZoomControls zoom={zoom} setZoom={setZoom} />
      </div>
    </div>
  );
}

const ZoomControls = ({ zoom, setZoom }: ControlsProps) => (
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
);

const AspectRatioControls = ({
  isDropdownOpen,
  setIsDropdownOpen,
  handleAspectRatioChange,
}: AspectRatioMenu) => (
  <div className={cropStyles.aspectRatioContainer}>
    {/* 비율 선택 버튼 */}
    <button
      className={cropStyles.aspectRatioButton}
      onClick={() => setIsDropdownOpen((prev) => !prev)}
    >
      <Image
        src={'/posts/aspect-ratio.svg'}
        width={24}
        height={24}
        alt="Aspect Ratio Image"
        className={cropStyles.aspectRatioIcon}
      />
    </button>

    {/* 드롭다운 메뉴 */}
    {isDropdownOpen && (
      <ul className={cropStyles.dropdownMenu}>
        {ASPECT_RATIOS.map((ratio) => (
          <li
            key={ratio.value}
            className={cropStyles.dropdownItem}
            onClick={() => handleAspectRatioChange(ratio.value)}
          >
            {ratio.label}
          </li>
        ))}
      </ul>
    )}
  </div>
);
