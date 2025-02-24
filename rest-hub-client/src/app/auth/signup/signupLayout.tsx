import styles from '@/styles/signup.module.css';
import AuthButton from '@/components/auth/authButton';
import Divider from '@/components/ui/divider';
import Brand from '@/components/ui/brand';

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
            <AuthButton text="Google" iconSrc="/login/google.svg" altText="Google Icon" />
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
