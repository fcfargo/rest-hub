'use client';

import LoginForm from '@/app/auth/login/loginForm';
import LoginLayout from '@/app/auth/login/loginLayout';

export default function Login() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
