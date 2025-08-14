import React from 'react';
import { useAuth } from '../auth/AuthContext';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.logout} onClick={logout}>Logout</button>
      </header>

      <div className={styles.content}>
        <p>This is a protected page. Try reloading — the app will refresh your session automatically if the refresh token is valid.</p>
      </div>
    </div>
  );
};

export default Dashboard;
