'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/forms/InputField';
import { CloseButtonBlack } from '@/components/ui/closeButton';
import { ErrorMessage, SuccessMessage } from '@/components/ui/message';
import { ERROR_CODES, HTTP_STATUS_CODES, INPUT_TYPES, ROUTES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/settings/passwordChangeModal.module.css';
import { apiRequest } from '@/utils/apiRequest';
import { extractErrorInfo } from '@/utils/errorGuards';

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, { message: '비밀번호는 8자리 이상 입력해야 합니다.' }),
    newPassword: z
      .string()
      .min(8, { message: '비밀번호는 8자리 이상 입력해야 합니다.' })
      .regex(/[a-zA-Z]/, '비밀번호는 영문을 포함해야 합니다.')
      .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다.')
      .regex(/[\W_]/, '비밀번호는 특수문자를 포함해야 합니다.'),
    repeatPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['repeatPassword'],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export default function PasswordChangeModal() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onChange',
  });

  const isMounted = useMounted();
  const { closeModal } = useModal();
  const { logout } = useAuth();

  const onSubmit = async ({ currentPassword, newPassword }: PasswordChangeFormValues) => {
    setMessage(null);
    setIsSuccess(false);

    try {
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.post(
          API_ENDPOINTS.CHANGE_PASSWORD,
          {
            oldPassword: currentPassword,
            newPassword,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }, logout);

      if (!data.body) {
        throw new Error('failed to change password from the server');
      }

      setMessage('비밀번호 변경이 완료됐습니다. 변경된 비밀번호를 확인해주세요.');
      setIsSuccess(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error: unknown) => {
    console.error('Password change failed:', error);

    const { status, code } = extractErrorInfo(error);

    let errorMessage = '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.';

    if (status === HTTP_STATUS_CODES.BAD_REQUEST) {
      errorMessage =
        '이 이메일은 소셜 로그인 계정입니다. 비밀번호를 변경하려면 일반 로그인 계정을 사용해야 합니다.';
    } else if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      if (code === ERROR_CODES.INVALID__PASSWORD) {
        errorMessage = '현재 비밀번호가 틀렸습니다. 비밀번호를 정확히 입력해 주세요.';
      } else if (code === ERROR_CODES.USER_NOT_FOUND) {
        closeModal();
        logout();
        router.push(ROUTES.AUTH.LOGIN);
        return;
      }
    }

    setMessage(errorMessage);
  };

  return (
    <div className={styles.overlay}>
      <div className={classNames(styles.container, isMounted ? styles.active : '')}>
        <div className={styles.wrapper}>
          {/* 모달 창 닫기 버튼 */}
          <CloseButtonBlack onClick={() => closeModal()} className={'mt-[16px] -mr-[32px]'} />

          {/* 제목 */}
          <h2 className={styles.title}>비밀번호 변경</h2>

          {/* 설명 */}
          <p className={styles.description}>
            비밀번호는 최소 8자리 이상이어야 하며 숫자, 영문, 특수문자의 조합을 포함해야 합니다.
          </p>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
            <InputField
              type={INPUT_TYPES.PASSWORD}
              placeholder="현재 비밀번호"
              isEyesImage={true}
              iconSrc="/auth/password.svg"
              altText="Current Password Icon"
              {...register('currentPassword')}
              errorMessage={errors.currentPassword?.message}
            />

            <InputField
              type={INPUT_TYPES.PASSWORD}
              placeholder="새 비밀번호"
              isEyesImage={true}
              iconSrc="/auth/password.svg"
              altText="New Password Icon"
              {...register('newPassword')}
              errorMessage={errors.newPassword?.message}
            />

            <InputField
              type={INPUT_TYPES.PASSWORD}
              placeholder="비밀번호 확인"
              isEyesImage={true}
              iconSrc="/auth/password.svg"
              altText="Repeat Password Icon"
              {...register('repeatPassword')}
              errorMessage={errors.repeatPassword?.message}
            />

            {/* 제출 버튼 */}
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? '요청 중...' : isSuccess ? '요청 완료' : 'Continue'}
            </button>

            {/* 에러 메시지 출력 */}
            {message &&
              (isSuccess ? (
                <SuccessMessage message={message} />
              ) : (
                <ErrorMessage message={message} />
              ))}
          </form>
        </div>
      </div>
    </div>
  );
}
