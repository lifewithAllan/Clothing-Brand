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

// For now simulate league → badges mapping.
// In a real app, badges would be fetched from backend by league.
const LEAGUE_BADGES: Record<string, string[]> = {
  'Premier League': ['ChampionsPatch', 'NoRoomForRacism', 'RespectBadge'],
  'La Liga': ['ChampionsPatch', 'FairPlay', 'SponsorPatch'],
  'Serie A': ['Scudetto', 'TIMSponsor', 'CopaItaliaBadge'],
};

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
      setSize(p.sizes?.[0] ?? null);
      // default league is first in array
      setSelectedLeague(p.leagueNames?.[0] ?? null);
    }).finally(() => setLoading(false));
  }, [pid]);

  const toggleBadge = (b: string) => {
    setSelectedBadges(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const customPrintCost = useMemo(() => {
    return (customName.trim() || customNumber.trim()) ? 300 : 0;
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
    if (!product || !size || !selectedLeague) return alert('Please select size and league.');
    try {
      await add({
        jerseyId: product.id,
        size,
        versionSelected: version,
        customName: customName || null,
        customNumber: customNumber || null,
        quantity,
        leagueName: selectedLeague!,
        badges: selectedBadges,
      });
      alert('Added to cart');
      navigate('/cart');
    } catch (err: any) {
      alert('Failed to add to cart');
    }
  };

  if (loading) return <div>Loading…</div>;
  if (!product) return <div>Product not found</div>;

  const availableBadges = selectedLeague ? (LEAGUE_BADGES[selectedLeague] ?? []) : [];

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
            <div className={styles.meta}>
              {product.season} • {product.kitVersion} Version
            </div>
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

              <label>League
                <select value={selectedLeague ?? ''} onChange={e => {
                  setSelectedLeague(e.target.value);
                  setSelectedBadges([]); // reset badges when league changes
                }}>
                  {product.leagueNames?.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </label>

              <label>Name to print
                <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Player name" />
              </label>

              <label>Number
                <input value={customNumber} onChange={e => setCustomNumber(e.target.value)} placeholder="10" />
              </label>

              <div className={styles.badges}>
                <h5>Badges for {selectedLeague ?? 'No league selected'}</h5>
                <div className={styles.badgeList}>
                  {availableBadges.length > 0 ? (
                    availableBadges.map(b => (
                      <label key={b} className={styles.badgeChip}>
                        <input
                          type="checkbox"
                          checked={selectedBadges.includes(b)}
                          onChange={() => toggleBadge(b)}
                        /> {b}
                      </label>
                    ))
                  ) : (
                    <div>No badges available</div>
                  )}
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
