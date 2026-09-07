import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AdminRedirect() {
  const location = useLocation();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const target = `${backendUrl}${location.pathname}${location.search}`;
    window.location.replace(target);
  }, [location]);

  return (
    <div className="text-center my-5">
      <div className="spinner-border" role="status" style={{ color: 'var(--iris)' }}>
        <span className="sr-only">Redirecting to admin...</span>
      </div>
      <p className="mt-3">Redirecting to Django Admin...</p>
    </div>
  );
}
