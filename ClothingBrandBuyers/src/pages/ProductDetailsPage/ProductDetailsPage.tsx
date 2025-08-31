import React, { useEffect, useMemo, useState } from 'react';
import BuyerNavbar from '../../components/nav/BuyerNavbar';
import HamburgerMenu from '../../components/nav/HamburgerMenu';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import { getProduct } from '../../api/productApi';
import type { Product } from '../../types/product';
import styles from './ProductDetailsPage.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { BADGE_PRICE } from '../../constants/config';
import { useCart } from '../../app/contexts/CartContext';

const ALL_SIZES = ['S','M','L','XL','XXL','3XL'];

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const pid = Number(id);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [size, setSize] = useState<string | null>(null);
  const [version, setVersion] = useState<'Fan' | 'Player' | 'Retro' | 'Special'>('Fan');
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { add, refresh } = useCart();

  useEffect(() => {
    setLoading(true);
    getProduct(pid).then(p => {
      setProduct(p);
      // default size
      setSize(p.sizes?.[0] ?? null);
      setSelectedLeague(p.leagueName ?? null);
    }).finally(() => setLoading(false));
  }, [pid]);

  const toggleBadge = (b: string) => {
    setSelectedBadges(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const customPrintCost = useMemo(() => {
    return (customName.trim() || customNumber.trim()) ? 300 : 0; // keep consistent with server (if you keep it there)
  }, [customName, customNumber]);

  const badgesCost = useMemo(() => {
    return (selectedBadges?.length ?? 0) * BADGE_PRICE;
  }, [selectedBadges]);

  const basePrice = product?.discountedPrice ?? product?.basePrice ?? 0;

  const total = useMemo(() => {
    return (basePrice * quantity) + customPrintCost + badgesCost;
  }, [basePrice, quantity, customPrintCost, badgesCost]);

  const { items } = useCart();

  const onAddToCart = async () => {
    if (!product || !size) return alert('Please select a size.');
    try {
      await add({
        jerseyId: product.id,
        size,
        versionSelected: version,
        customName: customName || null,
        customNumber: customNumber || null,
        quantity,
        badgesSelected: selectedBadges,
      });
      alert('Added to cart');
      navigate('/cart');
    } catch (err: any) {
      alert('Failed to add to cart');
    }
  };

  if (loading) return <div>Loading…</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <BuyerNavbar />
      <HamburgerMenu />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.left}>
            <ImageCarousel images={[product.frontImageUrl, product.sideImageUrl, product.backImageUrl]} alt={product.jerseyName} />
          </div>
          <div className={styles.right}>
            <h2>{product.jerseyName}</h2>
            <div className={styles.meta}>{product.season} • {product.kitVersion} • {product.leagueName}</div>
            <ul>
              {product.descriptionPoints.map((d,i)=> <li key={i}>{d}</li>)}
            </ul>

            <div className={styles.section}>
              <label>Size
                <select value={size ?? ''} onChange={e => setSize(e.target.value)}>
                  {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label>Version
                <select value={version} onChange={e => setVersion(e.target.value as any)}>
                  <option>Fan</option>
                  <option>Player</option>
                  <option>Retro</option>
                  <option>Special</option>
                </select>
              </label>
            </div>

            <div className={styles.section}>
              <h4>Customize</h4>
              <label>Name to print
                <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Player name" />
              </label>
              <label>Number
                <input value={customNumber} onChange={e => setCustomNumber(e.target.value)} placeholder="10" />
              </label>

              <div className={styles.badges}>
                <h5>League: {product.leagueName}</h5>
                <div className={styles.badgeList}>
                  {/* Backend provides badges in league get; but product response doesn't include badges list in this simplified API.
                      In a real app you would fetch league badges separately. For demo, simulate a few badges if none exist. */}
                  {product.leagueName ? (
                    // placeholder badges: in real app fetch /api/buyer/leagues/:id/badges
                    ['ChampionsPatch', 'SponsorPatch', 'AnniversaryBadge'].map(b => (
                      <label key={b} className={styles.badgeChip}><input type="checkbox" checked={selectedBadges.includes(b)} onChange={() => toggleBadge(b)} /> {b}</label>
                    ))
                  ) : <div>No league badges</div>}
                </div>
              </div>
            </div>

            <div className={styles.priceBox}>
              <div>Total: <strong>KSh {total.toFixed(2)}</strong></div>
              <div className={styles.actions}>
                <button className={styles.primary} onClick={onAddToCart}>Add to Cart</button>
                <button className={styles.secondary} onClick={() => navigate('/checkout')}>Next - Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetailsPage;
