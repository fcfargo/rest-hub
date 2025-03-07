'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '@/styles/sidebarSettings.module.css';

const sidebarItems = [
  { href: '', src: '/settings/profile.svg', label: '프로필 편집' },
  { href: '/settings/security', src: '/settings/security.svg', label: '비밀번호 및 보안' },
  { href: '', src: '/settings/notifications.svg', label: '알림' },
];

function SidebarItem({ href, src, label }: { href: string; src: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`${styles.item} ${isActive ? styles.itemActive : ''}`}>
      {isActive && (
        <div className={`${styles.activeIndicator} ${styles.activeIndicatorVisible}`}></div>
      )}
      <Image
        className={`${styles.itemIcon} ${isActive ? styles.itemIconActive : ''}`}
        src={src}
        alt={`${label} Icon`}
        width={0}
        height={0}
      />
      <p className={`${styles.itemName} ${isActive ? styles.itemNameActive : ''}`}>{label}</p>
    </Link>
  );
}

export default function SidebarSettings() {
  return (
    <aside className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>설정</div>
        <div className={styles.navigationList}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>계정</div>
            <div className={styles.sectionContent}>
              {sidebarItems.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
            <div className={styles.divider}></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
