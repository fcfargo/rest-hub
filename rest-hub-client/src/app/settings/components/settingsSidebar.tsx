'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { ROUTES } from '@/constants';
import { useMounted } from '@/hooks/useMounted';
import styles from '@/styles/settings/settingsSidebar.module.css';

interface SidebarItemProps {
  path: string;
  src: string;
  label: string;
  onClick?: () => void;
}

function SidebarItem({ path, src, label, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <button
      className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
      onClick={onClick}
      disabled={!onClick}
    >
      {isActive && (
        <div className={`${styles.activeIndicator} ${styles.activeIndicatorVisible}`}></div>
      )}
      <Image
        className={`${styles.itemIcon} ${isActive ? styles.itemIconActive : ''}`}
        src={src}
        alt={`${label} Icon`}
        width={18}
        height={18}
      />
      <p className={`${styles.itemName} ${isActive ? styles.itemNameActive : ''}`}>{label}</p>
    </button>
  );
}

export default function SettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useMounted();

  const sidebarItems = [
    { path: '', src: '/settings/profile.svg', label: '프로필 편집' },
    {
      path: ROUTES.SETTINGS.SECURITY,
      src: '/settings/security.svg',
      label: '비밀번호 및 보안',
      onClick: () =>
        router.push(
          pathname === ROUTES.SETTINGS.HOME ? ROUTES.SETTINGS.SECURITY : ROUTES.SETTINGS.HOME,
        ),
    },
    { path: '', src: '/settings/notifications.svg', label: '알림' },
  ];

  return (
    <aside className={classNames(styles.container, isMounted ? styles.active : '')}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>설정</h2>
        <nav className={styles.navigationList}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>계정</div>
            <div className={styles.sectionContent}>
              {sidebarItems.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
            <div className={styles.divider}></div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
