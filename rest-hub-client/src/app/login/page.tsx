'use client';
import { useState } from 'react';
import styles from '@/styles/login.module.css';
import InputField from '@/components/forms/inputField';
import AuthButton from '@/components/auth/authButton';
import Divider from '@/components/ui/divider';
import Brand from '@/components/ui/brand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.wrapper}>
      {/* 로그인 페이지 grid 왼쪽 요소 */}
      <div className={styles.loginContainer}>
        {/* 로고 및 브랜드 */}
        <Brand />

        {/* 로그인 프레임 */}
        <div className={styles.loginFrame}>
          <div className={styles.login}>
            {/* 로그인 텍스트 */}
            <div className={styles.loginText}>Log in</div>

            <div className={styles.loginWindow}>
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

              {/* 로그인 버튼 */}
              <button className={styles.button}>Log in</button>

              {/* 비밀번호 찾기 */}
              <div className={styles.forgotPassword}>Forgot password?</div>

              {/* 중간 구분선 */}
              <Divider />

              {/* 구글 로그인 버튼 */}
              <AuthButton text="Google" iconSrc="/login/google.svg" altText="Google Icon" />
            </div>
          </div>
        </div>
        {/* 회원가입 링크 */}
        <p className={styles.signupText}>
          Don’t have an account?{' '}
          <a href="/signup" className={styles.signupLink}>
            Sign Up
          </a>
        </p>
      </div>
      {/* 로그인 페이지 grid 오른쪽 요소 */}
      <div className={styles.rectangleContainer}>
        <div className={styles.ellipse}></div>
        <div className={styles.rectangle}></div>
      </div>
    </div>
  );
}
