'use client';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { PROFILE_IMAGE_DEFAULT, ROUTES } from '@/constants';
import { useAuth } from '@/context/authContext';
import styles from '@/styles/sidebar.module.css';
import globalStyles from '@/styles/utils.module.css';

const MENU_ITEMS = [
  { src: '/layout/sidebar/home.svg', alt: 'Home', label: 'Home', href: ROUTES.HOME },
  { src: '/layout/sidebar/search.svg', alt: 'Search', label: 'Search', href: '' },
  {
    src: '/layout/sidebar/notification.svg',
    alt: 'Notification',
    label: 'Notification',
    href: '',
  },
  {
    src: '/layout/sidebar/communities.svg',
    alt: 'Communities',
    label: 'Communities',
    href: '',
  },
  { src: '/layout/sidebar/post.svg', alt: 'Post', label: 'Post', href: '' },
  {
    src: '/layout/sidebar/settings.svg',
    alt: 'Settings',
    label: 'Settings',
    href: ROUTES.SETTINGS.HOME,
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const username = user.username;
  const profileImage = user.profileImage || PROFILE_IMAGE_DEFAULT;

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
      <Link
        href={ROUTES.HOME}
        className={classNames(styles.titleWrapper, {
          [globalStyles.hidden]: !expanded,
        })}
      >
        Rest Hub
      </Link>

      <nav className={styles.menu}>
        {MENU_ITEMS.map((item, index) => (
          <Link href={item.href} key={index} className={styles.menuItem}>
            <Image src={item.src} width={0} height={0} alt={item.alt} className={styles.menuIcon} />
            <span
              className={classNames(styles.textWrapper, {
                [globalStyles.hidden]: !expanded,
              })}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <button
        className={classNames(styles.footer, { [globalStyles.hidden]: !expanded })}
        onClick={() => logout()}
      >
        <Image src="/layout/sidebar/logout.svg" width={24} height={24} alt="Logout" />
        <span className={styles.textWrapper}>Logout</span>
      </button>

      <button
        className={`${styles.chevronsButton} ${
          expanded ? styles.expandedChevrons : styles.collapsedChevrons
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <Image
          src={
            expanded ? '/layout/sidebar/chevrons-left.svg' : '/layout/sidebar/chevrons-right.svg'
          }
          width={25}
          height={25}
          alt="Toggle Sidebar"
        />
      </button>

      <div className={`${styles.user} ${!expanded ? styles.userCollapsed : ''}`}>
        <div className={styles.profileWrapper}>
          <Image
            src={profileImage}
            width={48}
            height={48}
            alt="ProfileImage"
            className={styles.profileDefault}
          />
        </div>
        <span
          className={classNames(styles.textWrapper, {
            [globalStyles.hidden]: !expanded,
          })}
        >
          {username}
        </span>
      </div>
    </aside>
  );
}
