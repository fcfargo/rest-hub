import Link from 'next/link';
import { signIn } from 'next-auth/react';

import GoogleOAuthHandler from './googleOAuthHandler';
import AuthButton from '@/components/auth/AuthButton';
import Brand from '@/components/ui/Brand';
import Divider from '@/components/ui/Divider';
import { ROUTES } from '@/constants';
import styles from '@/styles/auth/login.module.css';

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
            <Link href={ROUTES.AUTH.RESET_PASSWORD} className={styles.forgotPassword}>
              Forgot password?
            </Link>
            <Divider />
            <GoogleOAuthHandler />
            <AuthButton
              text="Google"
              iconSrc="/auth/google.svg"
              altText="Google Icon"
              onClick={() => signIn('google')}
            />
          </div>
        </div>
        <p className={styles.signupText}>
          Don’t have an account?{' '}
          <Link href={ROUTES.AUTH.SIGNUP} className={styles.signupLink}>
            Sign Up
          </Link>
        </p>
      </div>
      <div className={styles.rectangleContainer}>
        <div className={styles.ellipse}></div>
        <div className={styles.rectangle}></div>
      </div>
    </div>
  );
}
