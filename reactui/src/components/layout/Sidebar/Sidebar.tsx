import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthContext } from '../../../context/AuthContext';

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: isActive ? '#3b82f6' : '#374151',
  backgroundColor: isActive ? '#eff6ff' : 'transparent',
  transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out',
});

export function Sidebar() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return null;

  return (
    <aside
      style={{
        width: '16rem',
        minHeight: '100%',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        padding: '1rem',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <NavLink to={ROUTES.DASHBOARD} style={navLinkStyle}>
          Dashboard
        </NavLink>
        <NavLink to={ROUTES.PROFILE} style={navLinkStyle}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}
