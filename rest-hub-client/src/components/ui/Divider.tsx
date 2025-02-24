import Image from 'next/image';
import styles from '@/styles/utils.module.css';

export default function Divider() {
  return (
    <div className={styles.middleBar}>
      <Image
        src="/login/left-line.svg"
        width={0}
        height={0}
        alt="Line"
        className={styles.middleBarImage}
      />
      <span className={styles.orText}>or</span>
      <Image
        src="/login/right-line.svg"
        width={0}
        height={0}
        alt="Line"
        className={styles.middleBarImage}
      />
    </div>
  );
}
