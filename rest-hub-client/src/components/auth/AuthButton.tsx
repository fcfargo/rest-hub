import Image from 'next/image';
import styles from '@/styles/authButton.module.css';
import classNames from 'classnames';

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  iconSrc: string;
  altText: string;
  className?: string;
}

export default function AuthButton({
  text,
  onClick,
  iconSrc,
  altText,
  className,
}: AuthButtonProps) {
  return (
    <button className={classNames(styles.authButton, className)} onClick={onClick}>
      <Image src={iconSrc} width={0} height={0} alt={altText} className={styles.authIcon} />
      {text}
    </button>
  );
}
