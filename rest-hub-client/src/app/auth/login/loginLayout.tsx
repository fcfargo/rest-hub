import { SessionProvider, signIn } from 'next-auth/react';

import GoogleOAuthHandler from './googleOAuthHandler';
import AuthButton from '@/components/auth/authButton';
import Brand from '@/components/ui/brand';
import Divider from '@/components/ui/divider';
import styles from '@/styles/login.module.css';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loginContainer}>
        <Brand />
        <div className={styles.loginFrame}>
          <div className={styles.login}>
            <div className={styles.loginText}>Log in</div>
            {children}
            <a href="/auth/reset-password" className={styles.forgotPassword}>
              Forgot password?
            </a>
            <Divider />
            <SessionProvider>
              <GoogleOAuthHandler />
              <AuthButton
                text="Google"
                iconSrc="/auth/google.svg"
                altText="Google Icon"
                onClick={() => signIn('google')}
              />
            </SessionProvider>
          </div>
        </div>
        <p className={styles.signupText}>
          Don’t have an account?{' '}
          <a href="/auth/signup" className={styles.signupLink}>
            Sign Up
          </a>
        </p>
      </div>
      <div className={styles.rectangleContainer}>
        <div className={styles.ellipse}></div>
        <div className={styles.rectangle}></div>
      </div>
    </div>
  );
}
