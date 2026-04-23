import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../utils/constants';
import styles from './Header.module.css';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local logout even if server call fails
    } finally {
      logout();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          MyApp
        </Link>
        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
              <Link to={ROUTES.PROFILE}>Profile</Link>
              {user && <span className={styles.username}>{user.username}</span>}
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>Login</Link>
              <Link to={ROUTES.REGISTER}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
