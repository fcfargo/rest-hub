import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Suspense } from 'react';

import GoogleOAuthHandler from '../login/googleOAuthHandler';

import AuthButton from '@/components/auth/AuthButton';
import Brand from '@/components/ui/Brand';
import Divider from '@/components/ui/Divider';
import { ROUTES } from '@/constants';
import styles from '@/styles/auth/signup.module.css';

interface SignUpLayoutProps {
  children: React.ReactNode;
}

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.signupContainer}>
        <div className={styles.brandContainer}>
          <Brand />
        </div>
        <div className={styles.signupFrame}>
          <div className={styles.signup}>
            <div className={styles.signupText}>Sign Up</div>
            {children}
            <div className={styles.dividerContainer}>
              <Divider />
            </div>
            <div className={styles.OAuthContainer}>
              <Suspense fallback={null}>
                <GoogleOAuthHandler />
              </Suspense>
              <AuthButton
                text="Google"
                iconSrc="/auth/google.svg"
                altText="Google Icon"
                onClick={() =>
                  signIn('google', {
                    callbackUrl: `${window.location.origin}${ROUTES.AUTH.LOGIN}?fromOAuth=true`,
                  })
                }
              />
            </div>
          </div>
        </div>
        <p className={styles.loginText}>
          Already have an account?{' '}
          <Link href={ROUTES.AUTH.LOGIN} className={styles.loginLink}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
