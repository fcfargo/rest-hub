'use client';
import SignUpForm from '@/app/auth/signup/signupForm';
import SignUpLayout from '@/app/auth/signup/signupLayout';

export default function SignUp() {
  return (
    <SignUpLayout>
      <SignUpForm />
    </SignUpLayout>
  );
}
