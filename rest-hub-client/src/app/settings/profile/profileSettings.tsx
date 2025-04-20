'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import TextField from '@/components/forms/TextField';
import EmojiButton from '@/components/ui/EmojiButton';
import { ErrorMessage, SuccessMessage } from '@/components/ui/message';
import { INPUT_TYPES, MEDIA_TYPES, PROFILE_IMAGE_DEFAULT, UPLOAD_OBJECT_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useLimitedTextarea } from '@/hooks/useLimitedMultilineInput';
import { useMounted } from '@/hooks/useMounted';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { uploadMediaToS3 } from '@/libs/upload';
import styles from '@/styles/settings/profileSettings.module.css';
import { TextValueUpdater } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { processImageFile } from '@/utils/fileProcessor';

interface ProfileSettingsHeaderProps {
  title: string;
}

interface ProfileImageSectionProps {
  previewUrl: string | null;
  onSelectFile: (file: File | null, url: string | null) => void;
}

interface UsernameSectionProps {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

interface DescriptionSectionProps {
  description: string;
  setDescription: (next: TextValueUpdater) => void;
  maxChars: number;
  maxLines: number;
  isOverCharLimit: boolean;
}

interface FooterProps {
  isSaving: boolean;
  onSave: () => void;
}

export default function ProfileSettings() {
  const maxChars = 250;
  const maxLines = 5;

  const currentUser = useProtectedUser();
  const isMounted = useMounted();
  const { logout } = useAuth();

  const {
    id: userId,
    username: currentUsername,
    description: currentDescription,
    profileImage,
  } = currentUser;

  const fileName = `profile_${userId}_${Date.now()}`;

  const [username, setUsername] = useState<string>(currentUsername);
  const {
    value: description,
    setValue: setDescription,
    isOverCharLimit,
  } = useLimitedTextarea({
    maxChars,
    maxLines,
    initialValue: currentDescription ?? '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profileImage);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string | null; success: boolean }>({
    message: null,
    success: false,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setFeedback({ message: null, success: false });

      let profileImageUrl: string | null = previewUrl;
      if (selectedFile) {
        profileImageUrl = await uploadMediaToS3({
          file: selectedFile,
          logout,
          objectType: UPLOAD_OBJECT_TYPES.PROFILE,
          fileName,
        });
        setPreviewUrl(profileImageUrl);
      }

      await apiRequest(async (accessToken: string) => {
        return api.patch(
          `${API_ENDPOINTS.USER}/${userId}/profile`,
          { username, description, profileImage: profileImageUrl },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      }, logout);

      setFeedback({ message: '프로필 업데이트가 완료됐습니다.', success: true });

      setTimeout(() => {
        setFeedback({ message: null, success: false });
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setFeedback({ message: '프로필 업데이트 중 문제가 발생했습니다.', success: false });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!feedback.message) {
      return;
    }

    const timer = setTimeout(() => setFeedback({ message: null, success: false }), 3000);
    return () => clearTimeout(timer);
  }, [feedback.message]);

  return (
    <div className={classNames(styles.container, isMounted ? styles.active : '')}>
      <div className={styles.wrapper}>
        <Header title="프로필 설정" />
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <UsernameSection username={username} setUsername={setUsername} />
            <DescriptionSection
              description={description}
              setDescription={setDescription}
              maxChars={maxChars}
              maxLines={maxLines}
              isOverCharLimit={isOverCharLimit}
            />
          </div>
          <div className={styles.rightColumn}>
            <ProfileImageSection
              previewUrl={previewUrl}
              onSelectFile={(file: File | null, url: string | null): void => {
                setSelectedFile(file);
                setPreviewUrl(url);
              }}
            />
          </div>
        </div>
        <Footer isSaving={isSaving} onSave={handleSave} />

        <div className={styles.errorContainer}>
          {feedback.message &&
            (feedback.success ? (
              <SuccessMessage message={feedback.message} />
            ) : (
              <ErrorMessage message={feedback.message} />
            ))}
        </div>
      </div>
    </div>
  );
}

const Header = ({ title }: ProfileSettingsHeaderProps) => (
  <header className={styles.header}>
    <h2 className={styles.headerTitle}>{title}</h2>
  </header>
);

const ProfileImageSection = ({ previewUrl, onSelectFile }: ProfileImageSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const imageSrc = previewUrl || PROFILE_IMAGE_DEFAULT;

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFile = (file: File | null) => {
    const result = processImageFile(file);

    if (!result.success) {
      setLocalMessage(result.errorMessage);
      return;
    }

    const { file: validFile, fileUrl } = result;

    onSelectFile(validFile, fileUrl);
    setLocalMessage(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
  };

  const handleClearImage = () => {
    onSelectFile(null, null);
    setLocalMessage(null);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>프로필 이미지</h3>
      <button className={styles.profileButton} onClick={triggerFileSelect}>
        <div className={styles.profileWrapper}>
          <Image
            src={imageSrc}
            alt="User Profile"
            fill
            priority
            className={classNames(styles.profileIcon, !previewUrl && styles.defaultProfileIcon)}
          />

          <input
            ref={fileInputRef}
            type={INPUT_TYPES.FILE}
            accept={`${MEDIA_TYPES.IMAGE}/*`}
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
        </div>
      </button>

      <div className={styles.editOverlay} onClick={triggerFileSelect}>
        <span className={styles.editText}>업로드</span>
      </div>

      {previewUrl && (
        <div className={styles.clearButtonContainer}>
          <button type="button" onClick={handleClearImage} className={styles.clearButton}>
            이미지 비우기
          </button>
        </div>
      )}

      <div className={styles.imageSectionErrorContainer}>
        {localMessage && <ErrorMessage message={localMessage} className="!text-[12px]" />}
      </div>
    </section>
  );
};

const UsernameSection = ({ username, setUsername }: UsernameSectionProps) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>유저네임</h3>

      <TextField
        value={username}
        onChange={setUsername}
        placeholder="유저네임을 입력하세요"
        maxLength={20}
        className="w-full sm:w-[90%] md:w-[65%] max-w-[550px] min-w-[200px]"
      />
    </section>
  );
};

const DescriptionSection = ({
  description,
  setDescription,
  maxChars,
  maxLines,
  isOverCharLimit,
}: DescriptionSectionProps) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>소개</h3>
      <TextField
        value={description}
        onChange={setDescription}
        placeholder="자기소개를 입력하세요"
        maxLength={maxChars}
        multiline={true}
        rows={maxLines}
        className="w-full sm:w-[90%] md:w-[65%] max-w-[550px] min-w-[200px]"
      />
      <div className="relative w-full sm:w-[90%] md:w-[65%] max-w-[550px] min-w-[200px] flex justify-between items-center px-1 py-[-0.5]">
        <EmojiButton
          setTextContent={setDescription}
          className="left-[-48px] top-[-24px] "
          iconSize={16}
        />
        <span className={styles.limitMessage}> 최대 5줄까지만 입력 가능합니다.</span>
      </div>

      <div className={styles.sectionMessageContainer}>
        {isOverCharLimit && (
          <ErrorMessage
            message={'최대 250자까지만 입력 가능합니다.'}
            className="!text-[12px] ml-[4px] mt-[-8px]"
          />
        )}
      </div>
    </section>
  );
};

const Footer = ({ isSaving, onSave }: FooterProps) => {
  return (
    <div className={styles.footer}>
      <button className={styles.saveButton} onClick={onSave} disabled={isSaving}>
        프로필 업데이트
      </button>
    </div>
  );
};
