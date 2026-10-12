import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
