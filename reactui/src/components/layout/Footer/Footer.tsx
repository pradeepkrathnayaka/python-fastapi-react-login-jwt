import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>&copy; {year} MyApp. All rights reserved.</p>
    </footer>
  );
}
