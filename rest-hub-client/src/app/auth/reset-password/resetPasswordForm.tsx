'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/forms/inputField';
import { HTTP_STATUS_CODES, ROUTES } from '@/constants';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/resetPassword.module.css';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async ({ email }: ResetPasswordFormValues) => {
    setMessage(null);
    setIsSuccess(false);

    try {
      const { data } = await api.post(API_ENDPOINTS.RESET_PASSWORD, { email });
      if (!data.body) {
        throw new Error('failed to send email from the server');
      }

      setMessage('이메일로 임시 비밀번호를 전송했습니다. 이메일을 확인해주세요.');
      setIsSuccess(true);

      setTimeout(() => {
        router.push(ROUTES.AUTH.LOGIN);
      }, 3000);
    } catch (error) {
      console.error('Reset password failed:', error);

      let errorMessage = '비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요.';
      const status = error.response?.status ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (status === HTTP_STATUS_CODES.BAD_REQUEST) {
        errorMessage =
          '이 이메일은 소셜 로그인 계정입니다. 비밀번호 재설정을 하려면 일반 로그인 계정을 사용해야 합니다.';
      } else if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        errorMessage =
          '입력하신 이메일로 가입된 계정을 찾을 수 없습니다. 이메일을 다시 확인해주세요.';
      }

      setMessage(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <InputField
        type="email"
        placeholder="Your email"
        iconSrc="/auth/email.svg"
        altText="Email Icon"
        {...register('email')}
        errorMessage={errors.email?.message}
      />

      <button className={styles.button} type="submit" disabled={isSubmitting || isSuccess}>
        {isSubmitting ? '요청 중...' : isSuccess ? '요청 완료' : 'Continue'}
      </button>

      {message && (
        <p className={isSuccess ? styles.successMessage : styles.failedMessage}>{message}</p>
      )}
    </form>
  );
}
