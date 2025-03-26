import Image from 'next/image';
import { useState } from 'react';

import { InputErrorMessage } from '../ui/message';
import { INPUT_TYPES } from '@/constants';
import styles from '@/styles/forms/input.module.css';

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
    isEyesImage && type === INPUT_TYPES.PASSWORD
      ? isPasswordVisible
        ? INPUT_TYPES.TEXT
        : INPUT_TYPES.PASSWORD
      : type;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className={styles.inputContainer}>
      <Image src={iconSrc} width={20} height={20} alt={altText} className={styles.icon} />

      <input className={styles.input} type={inputType} {...props} />

      {errorMessage && <InputErrorMessage message={errorMessage} />}

      {isEyesImage && type === INPUT_TYPES.PASSWORD && (
        <button type="button" className={styles.eyeButton} onClick={togglePasswordVisibility}>
          <Image
            src={isPasswordVisible ? '/auth/eyes-open.svg' : '/auth/eyes-closed.svg'}
            width={18}
            height={20}
            alt={isPasswordVisible ? 'Hide password' : 'Show password'}
            className={styles.eyeIcon}
          />
        </button>
      )}
    </div>
  );
}
