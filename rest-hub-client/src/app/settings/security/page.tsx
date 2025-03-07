'use client';

import Image from 'next/image';

import styles from '@/styles/securitySettings.module.css';

export default function SecuritySettings() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Header title="비밀번호 및 보안" />
        <div className={styles.content}>
          <AuthenticationSection />
        </div>
      </div>
    </div>
  );
}

const Header = ({ title }: { title: string }) => (
  <div className={styles.header}>
    <div className={styles.headerTitle}>{title}</div>
  </div>
);

const AuthenticationSection = () => (
  <div className={styles.section}>
    <div className={styles.sectionTitle}>인증</div>
    <button className={styles.button} onClick={() => console.log('@@@')}>
      <div className={styles.buttonText}>비밀번호 변경</div>
      <Image
        className={styles.arrowIcon}
        src="/settings/arrow.svg"
        alt="Change Password Icon"
        width={0}
        height={0}
      />
    </button>
  </div>
);
