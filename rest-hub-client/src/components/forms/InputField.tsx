import Image from 'next/image';

import styles from '@/styles/input.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconSrc: string;
  altText: string;
  ref?: (instance: HTMLInputElement | null) => void;
  errorMessage?: string;
}

export default function InputField({ iconSrc, altText, errorMessage, ...props }: InputFieldProps) {
  return (
    <div className={styles.inputContainer}>
      <Image src={iconSrc} width={0} height={0} alt={altText} className={styles.icon} />
      <input {...props} />

      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
}
