import React, { useMemo } from 'react';
import BuyerNavbar from '../../components/nav/BuyerNavbar';
import HamburgerMenu from '../../components/nav/HamburgerMenu';
import styles from './CartPage.module.css';
import { useCart } from '../../app/contexts/CartContext';
import { BADGE_PRICE } from '../../constants/config';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, remove, update, clear } = useCart();
  const navigate = useNavigate();

  const subtotal = useMemo(() => {
    return items?.reduce((s, it) => s + (it.itemTotal ?? 0), 0) ?? 0;
  }, [items]);

  if (!items) return <div>Loading cart…</div>;

  return (
    <>
      <BuyerNavbar />
      <HamburgerMenu />
      <main className={styles.main}>
        <div className={styles.container}>
          <h2>Your cart</h2>
          {items.length === 0 ? (
            <div className={styles.empty}>Your cart is empty.</div>
          ) : (
            <div className={styles.grid}>
              <div className={styles.list}>
                {items.map(it => (
                  <div key={it.id} className={styles.item}>
                    <img src={it.frontImageUrl} alt={it.jerseyName} />
                    <div className={styles.meta}>
                      <div className={styles.title}>{it.jerseyName}</div>
                      <div>Size: {it.size}</div>
                      <div>Version: {it.versionSelected}</div>
                      <div>Badges: {(it.badgesSelected ?? []).join(', ') || 'None'}</div>
                      <div>Custom: {it.customName || '-'} #{it.customNumber || '-'}</div>
                      <div>Qty: {it.quantity}</div>
                      <div>Line total: KSh {it.itemTotal.toFixed(2)}</div>
                      <div className={styles.actions}>
                        <button onClick={() => update(it.id, { ...it, quantity: Math.max(1, (it.quantity ?? 1) - 1) })}>−</button>
                        <button onClick={() => update(it.id, { ...it, quantity: (it.quantity ?? 1) + 1 })}>+</button>
                        <button onClick={() => remove(it.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className={styles.checkout}>
                <div className={styles.box}>
                  <div>Subtotal: KSh {subtotal.toFixed(2)}</div>
                  <div className={styles.actions}>
                    <button className={styles.primary} onClick={() => navigate('/checkout')}>Checkout</button>
                    <button className={styles.secondary} onClick={() => clear()}>Clear cart</button>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CartPage;
