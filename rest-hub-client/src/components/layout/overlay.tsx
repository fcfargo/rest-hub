'use client';

import classNames from 'classnames';

import styles from '@/styles/layout/overlay.module.css';

interface OverlayProps {
  onClick: () => void;
  className?: string;
}

export default function Overlay({ onClick, className = '' }: OverlayProps) {
  return <div className={classNames(styles.overlay, className)} onClick={onClick} />;
}
