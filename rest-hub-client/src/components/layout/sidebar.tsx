'use client';

import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import styles from '@/styles/sidebar.module.css';

const MENU_ITEMS = [
  { src: '/layout/sidebar/home.svg', alt: 'Home', label: 'Home' },
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
  { src: '/layout/sidebar/post.svg', alt: 'Post', label: 'Post' },
  {
    src: '/layout/sidebar/settings.svg',
    alt: 'Settings',
    label: 'Settings',
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
      <div
        className={classNames(styles.titleWrapper, {
          [styles.hidden]: !expanded,
        })}
      >
        Rest Hub
      </div>

      <nav className={styles.menu}>
        {MENU_ITEMS.map((item, index) => (
          <div key={index} className={styles.menuItem}>
            <Image src={item.src} width={24} height={24} alt={item.alt} />
            <span
              className={classNames(styles.textWrapper, {
                [styles.hidden]: !expanded,
              })}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      <div className={classNames(styles.footer, { [styles.hidden]: !expanded })}>
        <Image src="/layout/sidebar/logout.svg" width={24} height={24} alt="Logout" />
        <span className={styles.textWrapper}>Logout</span>
      </div>

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
            src="/layout/sidebar/profile-default.svg"
            width={48}
            height={48}
            alt="ProfileDefault"
            className={styles.profileDefault}
          />
        </div>
        <span
          className={classNames(styles.textWrapper, {
            [styles.hidden]: !expanded,
          })}
        >
          fcfargo
        </span>
      </div>
    </div>
  );
}
