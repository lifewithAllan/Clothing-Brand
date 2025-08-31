import React, { useMemo, useState } from 'react';
import BuyerNavbar from '../../components/nav/BuyerNavbar';
import HamburgerMenu from '../../components/nav/HamburgerMenu';
import styles from './CheckoutPage.module.css';
import { useCart } from '../../app/contexts/CartContext';
import { checkout } from '../../api/checkoutApi';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState<'PICKUP' | 'SHIPPING'>('PICKUP');
  const [county, setCounty] = useState('');
  const [town, setTown] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(() => items?.reduce((s, i) => s + (i.itemTotal ?? 0), 0) ?? 0, [items]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items || items.length === 0) return alert('Cart empty');
    setSubmitting(true);
    try {
      const cartIds = items.map(i => i.id);
      const payload = { deliveryOption, county, town, phone, cartItemIds: cartIds };
      const res = await checkout(payload);
      alert(`Order placed, ref: ${res.reference}`);
      await clear();
      navigate('/products');
    } catch (err: any) {
      alert('Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <BuyerNavbar />
      <HamburgerMenu />
      <main className={styles.main}>
        <div className={styles.container}>
          <h2>Checkout</h2>
          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.section}>
              <label>
                <input type="radio" name="delivery" checked={deliveryOption === 'PICKUP'} onChange={()=>setDeliveryOption('PICKUP')} /> Pickup
              </label>
              <label>
                <input type="radio" name="delivery" checked={deliveryOption === 'SHIPPING'} onChange={()=>setDeliveryOption('SHIPPING')} /> Delivery
              </label>
            </div>

            {deliveryOption === 'SHIPPING' && (
              <div className={styles.section}>
                <label>County<input value={county} onChange={e=>setCounty(e.target.value)} required /></label>
                <label>Town<input value={town} onChange={e=>setTown(e.target.value)} required /></label>
                <label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)} required /></label>
              </div>
            )}

            <div className={styles.summary}>
              <div>Items: {items?.length ?? 0}</div>
              <div>Total: KSh {subtotal.toFixed(2)}</div>
            </div>

            <div className={styles.actions}>
              <button className={styles.primary} type="submit" disabled={submitting}>{submitting ? 'Processing…' : 'Place order (simulate)'}</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
