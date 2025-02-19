import Image from 'next/image';
import styles from '@/styles/sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.titleWrapper}>Rest Hub</div>

      <nav className={styles.menu}>
        <div className={styles.menuItem}>
          <Image
            src="/layout/sidebar/home.svg"
            width={0}
            height={0}
            alt="Home"
            className={styles.homeIcon}
          />
          <span className={styles.textWrapper}>Home</span>
        </div>
        <div className={styles.menuItem}>
          <Image
            src="/layout/sidebar/search.svg"
            width={0}
            height={0}
            alt="Search"
            className={styles.icon}
          />
          <span className={styles.textWrapper}>Search</span>
        </div>
        <div className={styles.menuItem}>
          <Image
            src="/layout/sidebar/notification.svg"
            width={0}
            height={0}
            alt="Notification"
            className={styles.icon}
          />
          <span className={styles.textWrapper}>Notification</span>
        </div>
        <div className={styles.menuItem}>
          <Image
            src="/layout/sidebar/communities.svg"
            width={0}
            height={0}
            alt="Communities"
            className={styles.icon}
          />
          <span className={styles.textWrapper}>Communities</span>
        </div>
        <div className={styles.menuItem}>
          <Image
            src="/layout/sidebar/post.svg"
            width={0}
            height={0}
            alt="Post"
            className={styles.icon}
          />
          <span className={styles.textWrapper}>Post</span>
        </div>
        <div className={styles.menuItem}>
          <Image
            src="/layout/sidebar/settings.svg"
            width={0}
            height={0}
            alt="Settings"
            className={styles.icon}
          />
          <span className={styles.textWrapper}>Settings</span>
        </div>
      </nav>

      <div>
        <div className={styles.footer}>
          <Image
            src="/layout/sidebar/logout.svg"
            width={0}
            height={0}
            alt="Logout"
            className={styles.icon}
          />
          <span className={styles.textWrapper}>Logout</span>
        </div>
        <Image
          src="/layout/sidebar/chevrons-left.svg"
          width={0}
          height={0}
          alt="ChevronsLeft"
          className={styles.chevronsLeft}
        />
        <div className={styles.user}>
          <div className={styles.profileWrapper}>
            <Image
              src="/layout/sidebar/profile-default.svg"
              width={0}
              height={0}
              alt="ProfileDefault"
              className={styles.profileDefault}
            />
          </div>
          <span className={styles.textWrapper}>fcfargo</span>
        </div>
      </div>
    </div>
  );
}
