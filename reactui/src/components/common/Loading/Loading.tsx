import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function Loading({ size = 'md', message }: LoadingProps) {
  return (
    <div className={styles.container} role="status" aria-label={message ?? 'Loading...'}>
      <div className={[styles.spinner, styles[size]].join(' ')} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
