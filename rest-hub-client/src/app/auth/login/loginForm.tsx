'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/forms/inputField';
import styles from '@/styles/login.module.css';

const logInSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof logInSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(logInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Log In Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.loginWindow}>
      <InputField
        type="email"
        placeholder="Your email"
        iconSrc="/login/email.svg"
        altText="Email Icon"
        {...register('email')}
        errorMessage={errors.email?.message}
      />

      <InputField
        type="password"
        placeholder="Password"
        iconSrc="/login/password.svg"
        altText="Password Icon"
        {...register('password')}
        errorMessage={errors.password?.message}
      />

      {errors.root && <p className={styles.errorText}>{errors.root.message}</p>}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
