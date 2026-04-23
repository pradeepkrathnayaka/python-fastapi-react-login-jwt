import type { ReactNode } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';
import { useAuthContext } from '../../../context/AuthContext';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        {isAuthenticated && <Sidebar />}
        <main className={styles.main}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
