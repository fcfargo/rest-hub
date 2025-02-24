'use client';
import { useState } from 'react';
import styles from '@/styles/signup.module.css';
import InputField from '@/components/forms/inputField';
import AuthButton from '@/components/auth/authButton';
import Divider from '@/components/ui/divider';
import Brand from '@/components/ui/brand';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <div className={styles.wrapper}>
      {/* 로그인 페이지 grid 왼쪽 요소 */}
      <div className={styles.signupContainer}>
        {/* 로고 및 브랜드 */}
        <Brand />
        {/* 로그인 프레임 */}
        <div className={styles.signupFrame}>
          <div className={styles.signup}>
            {/* 로그인 텍스트 */}
            <div className={styles.signupText}>Sign Up</div>

            <div className={styles.signupWindow}>
              {/* 이메일 입력 */}
              <InputField
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                iconSrc="/login/email.svg"
                altText="Email Icon"
              />

              {/* 비밀번호 입력 */}
              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                iconSrc="/login/password.svg"
                altText="Password Icon"
              />

              {/* 비밀번호 확인 입력 */}
              <InputField
                type="repeat password"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                iconSrc="/login/password.svg"
                altText="Password Icon"
              />

              {/* 로그인 버튼 */}
              <button className={styles.button}>Sign Up</button>

              {/* 중간 구분선 */}
              <Divider />

              {/* 구글 로그인 버튼 */}
              <AuthButton text="Google" iconSrc="/login/google.svg" altText="Google Icon" />
            </div>
          </div>
        </div>
        {/* 회원가입 링크 */}
        <p className={styles.loginText}>
          Already have an account?{' '}
          <a href="/login" className={styles.loginLink}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
