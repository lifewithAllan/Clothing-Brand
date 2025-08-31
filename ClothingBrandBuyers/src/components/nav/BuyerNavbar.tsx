import React from 'react';
import styles from './BuyerNavbar.module.css';
import SearchBar from '../forms/SearchBar';
import { useAuth } from '../../app/contexts/AuthContext';
import { useUI } from '../../app/contexts/UIContext';
import { Link } from 'react-router-dom';
import { useCart } from '../../app/contexts/CartContext';

const BuyerNavbar: React.FC = () => {
  const { user } = useAuth();
  const { toggleMenu } = useUI();
  const { items } = useCart();

  const itemCount = items?.reduce((s, i) => s + (i.quantity ?? 1), 0) ?? 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.left}>
          <img src="/feelhouette logo.jpg" alt="logo" className={styles.logo} />
        </div>
        <div className={styles.center}><h1 className={styles.brand}>feelhouette</h1></div>
        <div className={styles.right}>
          <Link to="/cart" className={styles.cart} title="Cart">
            🛒<span className={styles.count}>{itemCount}</span>
          </Link>
          <button className={styles.burger} onClick={() => toggleMenu(true)} aria-label="Open menu">☰</button>
        </div>
      </div>

      <div className={styles.bottom}>
        <SearchBar />
      </div>
    </div>
  );
};

export default BuyerNavbar;
