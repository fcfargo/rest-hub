import styles from '@/styles/login.module.css';

export default function Brand() {
  return (
    <div className={styles.brandFrame}>
      <div className={styles.brandLogo}></div>
      <div className={styles.brandName}>Rest Hub</div>
    </div>
  );
}
