import Image from 'next/image';
import styles from '@/styles/input.module.css';

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconSrc: string;
  altText: string;
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  iconSrc,
  altText,
}: InputFieldProps) {
  return (
    <div className={styles.inputContainer}>
      <Image src={iconSrc} width={0} height={0} alt={altText} className={styles.icon} />
      <input
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
