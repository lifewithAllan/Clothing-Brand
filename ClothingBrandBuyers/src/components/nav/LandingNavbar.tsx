import React from 'react';
import styles from './LandingNavbar.module.css';
import { useUI } from '../../app/contexts/UIContext';

const LandingNavbar: React.FC = () => {
  const { openLogin } = useUI();
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src="/feelhouette logo.jpg" alt="Logo" className={styles.logo} />
      </div>
      <div className={styles.center}><h1 className={styles.brand}>feelhouette</h1></div>
      <div className={styles.right}>
        <button className={styles.login} onClick={openLogin}>Login</button>
      </div>
    </header>
  );
};

export default LandingNavbar;
