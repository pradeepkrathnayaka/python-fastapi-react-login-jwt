import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '5rem', fontWeight: 800, margin: 0, color: '#3b82f6' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', maxWidth: '24rem' }}>
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to={ROUTES.HOME}
        style={{
          padding: '0.5rem 1.25rem',
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
