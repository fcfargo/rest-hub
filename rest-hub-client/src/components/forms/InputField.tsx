import Image from 'next/image';
import { useCallback, useState } from 'react';

import styles from '@/styles/input.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconSrc: string;
  altText: string;
  type: string;
  isEyesImage?: boolean;
  errorMessage?: string;
}

export default function InputField({
  iconSrc,
  altText,
  type,
  isEyesImage = false,
  errorMessage,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType =
    isEyesImage && type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <div className={styles.inputContainer}>
      <Image src={iconSrc} width={0} height={0} alt={altText} className={styles.icon} />

      <input className={styles.input} type={inputType} {...props} />

      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

      {isEyesImage && type === 'password' && (
        <button type="button" className={styles.eyeButton} onClick={togglePasswordVisibility}>
          <Image
            src={isPasswordVisible ? '/auth/eyes-open.svg' : '/auth/eyes-closed.svg'}
            width={0}
            height={0}
            alt={isPasswordVisible ? 'Hide password' : 'Show password'}
            className={styles.eyeIcon}
          />
        </button>
      )}
    </div>
  );
}
