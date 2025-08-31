import React from 'react';
import styles from './HamburgerMenu.module.css';
import { useUI } from '../../app/contexts/UIContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { NavLink } from 'react-router-dom';

const HamburgerMenu: React.FC = () => {
  const { menuOpen, toggleMenu } = useUI();
  const { user, logout } = useAuth();

  if (!menuOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => toggleMenu(false)}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={() => toggleMenu(false)}>×</button>

        <div className={styles.user}>
          <div className={styles.name}>{user?.firstName ?? 'Buyer'}</div>
          <div className={styles.name}>{user?.lastName ?? 'Buyer'}</div>
          <div className={styles.name}>{user?.email ?? 'Buyer'}</div>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/products" className={({isActive}) => isActive ? styles.active : ''} onClick={() => toggleMenu(false)}>Products</NavLink>
          <NavLink to="/about" onClick={() => toggleMenu(false)}>About Us</NavLink>
          <NavLink to="/contact" onClick={() => toggleMenu(false)}>Contact Us</NavLink>
          <NavLink to="/sponsors" onClick={() => toggleMenu(false)}>Sponsors</NavLink>
        </nav>

        <div className={styles.bottom}>
          <button className={styles.logout} onClick={() => { logout(); toggleMenu(false); }}>Logout</button>
        </div>
      </aside>
    </div>
  );
};

export default HamburgerMenu;
