import { Dispatch, SetStateAction } from 'react';
import Cropper from 'react-easy-crop';

import { Crop, CroppedAreaPixels } from '@/app/posts/create/steps/PostCreateCrop';
import styles from '@/styles/media/mediaCrop.module.css';

export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

interface MediaCropProps {
  fileUrl: string;
  crop: Crop;
  zoom: number;
  aspect: number;
  setCrop: Dispatch<SetStateAction<Crop>>;
  setZoom: Dispatch<SetStateAction<number>>;
  onCropComplete: (_: Area, croppedAreaPixels: CroppedAreaPixels) => void;
}

export default function MediaCrop({
  fileUrl,
  crop,
  zoom,
  aspect,
  setCrop,
  setZoom,
  onCropComplete,
}: MediaCropProps) {
  return (
    <div className={styles.cropContainer}>
      <Cropper
        image={fileUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}
