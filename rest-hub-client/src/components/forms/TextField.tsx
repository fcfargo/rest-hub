'use client';

import classNames from 'classnames';

import styles from '@/styles/forms/textField.module.css';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export default function TextField({
  value,
  onChange,
  placeholder = '',
  multiline = false,
  rows = 3,
  maxLength,
  disabled = false,
  className,
}: TextFieldProps) {
  return (
    <div className={classNames(styles.container, className)}>
      {multiline ? (
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
        />
      ) : (
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
        />
      )}
    </div>
  );
}
