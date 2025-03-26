import classNames from 'classnames';

import { useMounted } from '@/hooks/useMounted';
import styles from '@/styles/utils/utils.module.css';

interface MessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: MessageProps) {
  const isMounted = useMounted();

  return (
    <div className={styles.messageWrapper}>
      <p className={classNames(styles.errorText, className, isMounted ? styles.active : '')}>
        {message}
      </p>
    </div>
  );
}

export function SuccessMessage({ message, className }: MessageProps) {
  const isMounted = useMounted();

  return (
    <div className={styles.messageWrapper}>
      <p className={classNames(styles.successText, className, isMounted ? styles.active : '')}>
        {message}
      </p>
    </div>
  );
}

export function InputErrorMessage({ message, className }: MessageProps) {
  const isMounted = useMounted();

  return (
    <div className={styles.inputMessageWrapper}>
      <p className={classNames(styles.inputErrorText, className, isMounted ? styles.active : '')}>
        {message}
      </p>
    </div>
  );
}
