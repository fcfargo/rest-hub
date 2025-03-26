'use client';

import classNames from 'classnames';
import Image from 'next/image';

import { MODAL_TYPES } from '@/constants';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import styles from '@/styles/settings/securitySettings.module.css';

interface SecuritySettingsHeaderProps {
  title: string;
}

export default function SecuritySettings() {
  const isMounted = useMounted();

  return (
    <div className={classNames(styles.container, isMounted ? styles.active : '')}>
      <div className={styles.wrapper}>
        <Header title="비밀번호 및 보안" />
        <div className={styles.content}>
          <AuthenticationSection />
        </div>
      </div>
    </div>
  );
}

const Header = ({ title }: SecuritySettingsHeaderProps) => (
  <header className={styles.header}>
    <h2 className={styles.headerTitle}>{title}</h2>
  </header>
);

const AuthenticationSection = () => {
  const { openModal } = useModal();

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>인증</h3>
      <button className={styles.button} onClick={() => openModal(MODAL_TYPES.PASSWORD_CHANGE)}>
        <span className={styles.buttonText}>비밀번호 변경</span>
        <Image
          className={styles.arrowIcon}
          src="/settings/arrow.svg"
          alt="Change Password Icon"
          width={16}
          height={16}
        />
      </button>
    </section>
  );
};
