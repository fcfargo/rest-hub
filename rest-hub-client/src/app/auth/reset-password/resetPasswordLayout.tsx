import Image from 'next/image';
import Link from 'next/link';

import styles from '@/styles/resetPassword.module.css';

interface ResetPasswordLayoutProps {
  children: React.ReactNode;
}

export default function ResetPasswordLayout({ children }: ResetPasswordLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.passwordImage}
            src="/auth/reset-password.svg"
            alt="Reset Password"
            width={0}
            height={0}
          />
        </div>

        <h2 className={styles.title}>비밀번호 재설정</h2>
        <p className={styles.description}>
          가입 시 등록한 이메일을 입력하면, 이메일로 임시 비밀번호를 전송해드립니다.
        </p>
        {children}
      </div>
      <div className={styles.linkText}>
        <span>Got your temporary password? </span>
        <Link href="/auth/login" className={styles.link}>
          Log in
        </Link>
      </div>
    </div>
  );
}
