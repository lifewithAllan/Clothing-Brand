import React from 'react';
import styles from './HamburgerMenu.module.css';
import { useUI } from '../../app/contexts/UIContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const HamburgerMenu: React.FC = () => {
  const { menuOpen, toggleMenu } = useUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!menuOpen) return null;

  // Handle account deletion request
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/buyer/account/delete/request`, 
        { firstName: user?.firstName },
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // auth header
        },
      });
      alert("A confirmation email has been sent. Please check your inbox to complete account deletion.");
      toggleMenu(false);
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      alert("Failed to send account deletion email. Please try again later.");
    }
  };

  return (
    <div className={styles.overlay} onClick={() => toggleMenu(false)}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={() => toggleMenu(false)}>×</button>

        <div className={styles.user}>
          <div className={styles.name}>Hello</div>
          <div className={styles.name}>{user?.email ?? 'Buyer'}</div>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/products" className={({isActive}) => isActive ? styles.active : ''} onClick={() => toggleMenu(false)}>Products</NavLink>
          <NavLink to="/about" onClick={() => toggleMenu(false)}>About Us</NavLink>
          <NavLink to="/contact" onClick={() => toggleMenu(false)}>Contact Us</NavLink>
          <NavLink to="/sponsors" onClick={() => toggleMenu(false)}>Sponsors</NavLink>
        </nav>

        <div className={styles.bottom}>
          <button className={styles.logout} onClick={() => { logout(); toggleMenu(false); navigate('/', { replace: true });}}>Logout</button>
          <button className={styles.deleteAccount} onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </aside>
    </div>
  );
};

export default HamburgerMenu;
