import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../auth/AuthContext';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Decide where search should route: products or leagues
  const searchTarget = useMemo(() => {
    if (location.pathname.startsWith('/app/leagues')) return '/app/leagues';
    return '/app/products';
  }, [location.pathname]);

  useEffect(() => {
    // Clear query when navigating between sections
    setQ('');
  }, [location.pathname]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = q.trim() ? `${searchTarget}?q=${encodeURIComponent(q.trim())}` : searchTarget;
    navigate(url);
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand} onClick={() => navigate('/app') }>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.brandText}>Seller Portal</span>
        </div>

        <button
          className={styles.burger}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          ☰
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <NavLink to="/app" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/app/products" className={linkClass} onClick={() => setMenuOpen(false)}>Products</NavLink>
          <NavLink to="/app/leagues" className={linkClass} onClick={() => setMenuOpen(false)}>Leagues</NavLink>
          <NavLink to="/app/add-product" className={linkClass} onClick={() => setMenuOpen(false)}>Add Product</NavLink>
          <NavLink to="/app/add-league" className={linkClass} onClick={() => setMenuOpen(false)}>Add League</NavLink>

          <form className={styles.search} onSubmit={onSubmit}>
            <input
              className={styles.searchInput}
              placeholder={`Search ${searchTarget.includes('league') ? 'leagues' : 'products'}...`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className={styles.searchBtn}>Search</button>
          </form>

          <button className={styles.logout} onClick={logout}>Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
