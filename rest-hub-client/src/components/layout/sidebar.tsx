'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/sidebar.module.css';

const menuElements = [
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
    <div
      className={`${styles.sidebar} ${
        expanded ? styles.expanded : styles.collapsed
      }`}
    >
      <div className={styles.titleWrapper}>{expanded && 'Rest Hub'}</div>

      <nav className={styles.menu}>
        {menuElements.map((item, index) => (
          <div key={index} className={styles.menuItem}>
            <Image
              src={item.src}
              width={0}
              height={0}
              alt={item.alt}
              className={styles.icon}
            />
            {expanded && (
              <span className={styles.textWrapper}>{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {expanded && (
        <div className={styles.footer}>
          <Image
            src="/layout/sidebar/logout.svg"
            width={0}
            height={0}
            alt="Logout"
            className={styles.icon}
          />
          <span className={styles.textWrapper}> Logout</span>
        </div>
      )}
      <button
        className={`${styles.chevronsButton} ${
          expanded ? styles.expandedChevrons : styles.collapsedChevrons
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <Image
          src={
            expanded
              ? '/layout/sidebar/chevrons-left.svg'
              : '/layout/sidebar/chevrons-right.svg'
          }
          width={25}
          height={25}
          alt="Toggle Sidebar"
        />
      </button>

      <div
        className={`${styles.user} ${!expanded ? styles.userCollapsed : ''}`}
      >
        <div className={styles.profileWrapper}>
          <Image
            src="/layout/sidebar/profile-default.svg"
            width={0}
            height={0}
            alt="ProfileDefault"
            className={styles.profileDefault}
          />
        </div>
        {expanded && <span className={styles.textWrapper}>fcfargo</span>}
      </div>
    </div>
  );
}
