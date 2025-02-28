'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/forms/inputField';
import { useAuth } from '@/context/authContext';
import inputStyles from '@/styles/input.module.css';
import styles from '@/styles/login.module.css';

const logInSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof logInSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(logInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoginError(null);

      const success = await login(data);
      if (!success) {
        setLoginError(
          '아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.',
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.loginWindow}>
      <InputField
        type="email"
        placeholder="Your email"
        iconSrc="/auth/email.svg"
        altText="Email Icon"
        {...register('email')}
        errorMessage={errors.email?.message}
      />

      <InputField
        type="password"
        placeholder="Password"
        iconSrc="/auth/password.svg"
        altText="Password Icon"
        {...register('password')}
        errorMessage={errors.password?.message}
      />

      {loginError && <p className={inputStyles.errorText}>{loginError}</p>}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
