import type { ReactNode, CSSProperties } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  style?: CSSProperties;
}

export function Card({ children, className, title, style }: CardProps) {
  return (
    <div className={[styles.card, className ?? ''].filter(Boolean).join(' ')} style={style}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
}
