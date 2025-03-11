'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/forms/inputField';
import { INPUT_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import styles from '@/styles/auth/signup.module.css';
import inputStyles from '@/styles/forms/input.module.css';

const signUpSchema = z
  .object({
    email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
    username: z.string().max(50, { message: '유저 네임은 50자리 이하만 가능합니다.' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자리 이상 입력해야 합니다.' })
      .regex(/[a-zA-Z]/, '비밀번호는 영문을 포함해야 합니다.')
      .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다.')
      .regex(/[\W_]/, '비밀번호는 특수문자를 포함해야 합니다.'),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['repeatPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const { signup } = useAuth();
  const [signupError, setSignupError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setSignupError(null);

      const success = await signup(data);
      if (!success) {
        setSignupError('이미 사용 중인 email 주소입니다.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setSignupError('회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.signupWindow}>
      {/* 이메일 입력 */}
      <InputField
        type={INPUT_TYPES.EMAIL}
        placeholder="Your email"
        iconSrc="/auth/email.svg"
        altText="Email Icon"
        {...register('email')}
        errorMessage={errors.email?.message}
      />

      {/* 유저 네임 입력 */}
      <InputField
        type={INPUT_TYPES.TEXT}
        placeholder="Username"
        iconSrc="/auth/username.svg"
        altText="Username Icon"
        {...register('username')}
        errorMessage={errors.username?.message}
      />

      {/* 비밀번호 입력 */}
      <InputField
        type={INPUT_TYPES.PASSWORD}
        placeholder="Password"
        isEyesImage={true}
        iconSrc="/auth/password.svg"
        altText="Password Icon"
        {...register('password')}
        errorMessage={errors.password?.message}
      />

      {/* 비밀번호 확인 입력 */}
      <InputField
        type={INPUT_TYPES.PASSWORD}
        placeholder="Repeat password"
        isEyesImage={true}
        iconSrc="/auth/password.svg"
        altText="Password Icon"
        {...register('repeatPassword')}
        errorMessage={errors.repeatPassword?.message}
      />

      {signupError && <p className={inputStyles.errorText}>{signupError}</p>}

      {/* 로그인 버튼 */}
      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
