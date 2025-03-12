import classNames from 'classnames';

import styles from '@/styles/utils/utils.module.css';

interface MessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: MessageProps) {
  return (
    <div className={styles.messageWrapper}>
      <p className={classNames(styles.errorText, className)}>{message}</p>
    </div>
  );
}

export function SuccessMessage({ message, className }: MessageProps) {
  return (
    <div className={styles.messageWrapper}>
      <p className={classNames(styles.successText, className)}>{message}</p>
    </div>
  );
}

export function InputErrorMessage({ message, className }: MessageProps) {
  return (
    <div className={styles.inputMessageWrapper}>
      <p className={classNames(styles.inputErrorText, className)}>{message}</p>
    </div>
  );
}
