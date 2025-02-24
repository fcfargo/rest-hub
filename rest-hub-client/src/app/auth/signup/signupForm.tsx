'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '@/styles/signup.module.css';
import InputField from '@/components/forms/inputField';

const signUpSchema = z
  .object({
    email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormValues) => {
    console.log('Sign Up Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.signupWindow}>
      {/* 이메일 입력 */}
      <InputField
        type="email"
        placeholder="Your email"
        iconSrc="/login/email.svg"
        altText="Email Icon"
        {...register('email')}
        errorMessage={errors.email?.message}
      />

      {/* 비밀번호 입력 */}
      <InputField
        type="password"
        placeholder="Password"
        iconSrc="/login/password.svg"
        altText="Password Icon"
        {...register('password')}
        errorMessage={errors.password?.message}
      />

      {/* 비밀번호 확인 입력 */}
      <InputField
        type="password"
        placeholder="Repeat password"
        iconSrc="/login/password.svg"
        altText="Password Icon"
        {...register('repeatPassword')}
        errorMessage={errors.repeatPassword?.message}
      />

      {/* 로그인 버튼 */}
      <button className={styles.button}>Sign Up</button>
    </form>
  );
}
