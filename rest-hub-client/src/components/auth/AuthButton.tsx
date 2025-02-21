import Image from 'next/image';
import styles from '@/styles/login.module.css';

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
    <button className={`${styles.authButton} ${className}`} onClick={onClick}>
      <Image src={iconSrc} width={0} height={0} alt={altText} className={styles.loginIcon} />
      {text}
    </button>
  );
}
