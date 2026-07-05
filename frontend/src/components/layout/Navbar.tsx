import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [env] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      name: params.get('env') || 'development',
      db: params.get('db') || '',
    };
  });

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm" style={{
      backgroundColor: 'var(--navbar-bg-color)',
      color: 'var(--navbar-text-color)',
      transition: 'all 0.3s ease',
    }}>
      <div className="navbar-brand row align-items-center">
        <Link
          to="/"
          className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <img
            id="brand-logo"
            className="img-fluid"
            width="150"
            src={theme === 'dark' ? '/static/logo/prokope-dark.png' : '/static/logo/prokope-light.png'}
            data-light-logo="/static/logo/prokope-light.png"
            data-dark-logo="/static/logo/prokope-dark.png"
            alt="Prokope"
          />
        </Link>
      </div>

      {env.name === 'QA' && (
        <span className="badge badge-warning ml-2">QA · {env.db}</span>
      )}
      {env.name === 'development' && (
        <span className="badge badge-info ml-2">Development · {env.db}</span>
      )}

      <button
        className="navbar-toggler navbar-light custom-toggler"
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-controls="main-navigation"
        aria-expanded={!collapsed}
        aria-label="Toggle navigation"
      >
        <span className="custom-toggler-icon" role="button">
          <i className="fa fa-bars fa-lg" aria-hidden="true"></i>
        </span>
      </button>

      <div className={`collapse navbar-collapse ${!collapsed ? 'show' : ''}`} id="main-navigation">
        <ul className="navbar-nav">
          <li className="nav-item mr-3">
            <Link
              to="/blog"
              className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
            >
              Blog
            </Link>
          </li>
          <li className="nav-item mr-3">
            <Link
              to="/gallery"
              className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
            >
              Gallery
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center">
            <span style={{ width: '100%' }}>
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  id="search-bar"
                  className="form-control mr-2"
                  type="search"
                  name="q"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  required
                />
              </form>
            </span>
            <button
              id="darkModeToggle"
              className="btn btn-outline-secondary"
              onClick={toggleTheme}
              style={{ border: 'none', background: 'none', fontSize: '1.5rem', minWidth: 48, cursor: 'pointer' }}
            >
              <i id="darkModeIcon" className={`fa ${theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}`}></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
