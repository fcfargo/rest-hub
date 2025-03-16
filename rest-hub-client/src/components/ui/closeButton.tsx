import classNames from 'classnames';
import Image from 'next/image';

import styles from '@/styles/utils/utils.module.css';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseButtonWhite({ onClick, className }: CloseButtonProps) {
  return (
    <button className={classNames(styles.closeButton, className)} onClick={onClick}>
      <Image
        className={styles.closeIcon}
        src="/settings/cancel-white.svg"
        alt="Close"
        width={24}
        height={24}
      />
    </button>
  );
}

export function CloseButtonBlack({ onClick, className }: CloseButtonProps) {
  return (
    <button className={classNames(styles.closeButton, className)} onClick={onClick}>
      <Image
        className={styles.closeIcon}
        src="/settings/cancel-black.svg"
        alt="Close"
        width={24}
        height={24}
      />
    </button>
  );
}
