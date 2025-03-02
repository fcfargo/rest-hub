import { SessionProvider, signIn } from 'next-auth/react';

import GoogleOAuthHandler from '../login/googleOAuthHandler';
import AuthButton from '@/components/auth/authButton';
import Brand from '@/components/ui/brand';
import Divider from '@/components/ui/divider';
import styles from '@/styles/signup.module.css';

interface SignUpLayoutProps {
  children: React.ReactNode;
}

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.signupContainer}>
        <Brand />
        <div className={styles.signupFrame}>
          <div className={styles.signup}>
            <div className={styles.signupText}>Sign Up</div>
            {children}
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
        <p className={styles.loginText}>
          Already have an account?{' '}
          <a href="/auth/login" className={styles.loginLink}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
