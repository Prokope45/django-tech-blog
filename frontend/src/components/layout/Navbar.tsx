import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../../api/client';
import { useTheme } from '../../context/ThemeContext';

interface EnvInfo {
  environment: string;
  database_label: string;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [env, setEnv] = useState<EnvInfo>({ environment: '', database_label: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryEnv = params.get('env');
    const queryDb = params.get('db');
    if (queryEnv) {
      setEnv({ environment: queryEnv, database_label: queryDb || '' });
      return;
    }
    client.get<EnvInfo>('/environment/')
      .then(res => setEnv(res.data))
      .catch(() => {});
  }, []);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeClass = (path: string) => (isActive(path) && !(path === '/' && location.pathname !== '/') ? 'active' : '');

  return (
    <nav className="navbar navbar-expand-sm bg-[var(--navbar-bg-color)] text-[var(--navbar-text-color)]">
      <div className="navbar-brand row align-items-center">
        <Link to="/" className={`nav-link ${activeClass('/')}`} aria-label="Prokope home">
          <img
            id="brand-logo"
            className="img-fluid"
            width="150"
            src={theme === 'dark' ? '/logo/prokope-dark.png' : '/logo/prokope-light.png'}
            data-light-logo="/logo/prokope-light.png"
            data-dark-logo="/logo/prokope-dark.png"
            alt="Prokope"
          />
        </Link>
      </div>

      {env.environment === 'QA' && (
        <span className="badge badge-warning ml-2">QA · {env.database_label}</span>
      )}
      {env.environment === 'development' && (
        <span className="badge badge-info ml-2">Development · {env.database_label}</span>
      )}

      <button
        className="navbar-toggler navbar-light custom-toggler"
        type="button"
        onClick={() => setCollapsed(prev => !prev)}
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
            <Link to="/blog" className={`nav-link ${activeClass('/blog')}`}>
              Blog
            </Link>
          </li>
          <li className="nav-item mr-3">
            <Link to="/gallery" className={`nav-link ${activeClass('/gallery')}`}>
              Gallery
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center">
            <span className="w-full md:w-40 lg:w-56">
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
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <i id="darkModeIcon" className={`fa ${theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}`}></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}