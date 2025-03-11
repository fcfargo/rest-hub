'use client';

import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { MODAL_TYPES, PROFILE_IMAGE_DEFAULT, ROUTES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import styles from '@/styles/layout/sidebar.module.css';
import globalStyles from '@/styles/utils/utils.module.css';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useAuth();
  const { openModal } = useModal();

  interface MenuItemProps {
    src: string;
    alt: string;
    label: string;
    href?: string;
    onClick?: () => void;
  }

  const MENU_ITEMS = [
    { src: '/layout/sidebar/home.svg', alt: 'Home', label: 'Home', href: ROUTES.HOME },
    { src: '/layout/sidebar/search.svg', alt: 'Search', label: 'Search' },
    {
      src: '/layout/sidebar/notification.svg',
      alt: 'Notification',
      label: 'Notification',
    },
    {
      src: '/layout/sidebar/communities.svg',
      alt: 'Communities',
      label: 'Communities',
    },
    {
      src: '/layout/sidebar/post.svg',
      alt: 'Post',
      label: 'Post',
      onClick: () => openModal(MODAL_TYPES.POST_CREATE),
    },
    {
      src: '/layout/sidebar/settings.svg',
      alt: 'Settings',
      label: 'Settings',
      href: ROUTES.SETTINGS.HOME,
    },
  ];

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
        {MENU_ITEMS.map((item: MenuItemProps, index: number) => (
          <Link
            href={item.href ?? ''}
            key={index}
            className={styles.menuItem}
            onClick={item.onClick ?? (() => {})}
          >
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
