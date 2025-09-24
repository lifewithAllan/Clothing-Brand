import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ProductDetails.module.css';
import ImageCarousel from '../../components/Carousel/ImageCarousel';
import { deleteJersey, listJerseys, updateJerseyPriceAndSizes } from '../../api/productApi';
import type { Jersey } from '../../types/seller';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const pid = Number(id);
  const navigate = useNavigate();

  const [items, setItems] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listJerseys().then(setItems).finally(() => setLoading(false));
  }, []);

  const product = useMemo(() => items.find(i => i.id === pid), [items, pid]);

  // local editable state
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [discountedPrice, setDiscountedPrice] = useState<number | ''>('');
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setBasePrice(product.basePrice);
      setDiscountedPrice(product.discountedPrice ?? '');
      setSizes(product.sizes);
    }
  }, [product]);

  const toggleSize = (sz: string) => {
    setSizes(prev =>
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  const onSave = async () => {
    if (typeof basePrice !== 'number') return;
    setSaving(true);
    try {
      const updated = await updateJerseyPriceAndSizes(
        pid,
        basePrice,
        discountedPrice === '' ? null : Number(discountedPrice),
        sizes
      );
      // replace in local list
      setItems(list => list.map(i => (i.id === updated.id ? updated : i)));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('Delete this product?')) return;
    await deleteJersey(pid);
    navigate('/app/products');
  };

  if (loading) return <div>Loading…</div>;
  if (!product) return <div className={styles.empty}>Product not found.</div>;

  return (
    <section className={styles.grid}>
      <div className={styles.left}>
        <ImageCarousel
          images={[product.frontImageUrl, product.sideImageUrl, product.backImageUrl]}
          alt={product.jerseyName}
        />
      </div>

      <div className={styles.right}>
        <h2 className={styles.title}>{product.jerseyName}</h2>
        <div className={styles.meta}>
          <span>{product.season}</span>  <span>{product.kitVersion} Version</span> <br />
          {product.leagueNames && product.leagueNames.length > 0 && (
            <>
              {' '}<span>{product.leagueNames.join(', ')}</span>
            </>
          )}
        </div>

        <ul className={styles.desc}>
          {product.descriptionPoints.map((d, i) => (
            <li key={`${d}-${i}`}>{d}</li>
          ))}
        </ul>

        <div className={styles.panel}>
          <h3 className={styles.h3}>Update Price & Sizes</h3>
          <div className={styles.row}>
            <label className={styles.label}>
              Base Price (KSh)
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={basePrice}
                onChange={e =>
                  setBasePrice(e.target.value ? Number(e.target.value) : '')
                }
              />
            </label>
            <label className={styles.label}>
              Discounted Price
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={discountedPrice}
                onChange={e =>
                  setDiscountedPrice(e.target.value ? Number(e.target.value) : '')
                }
              />
            </label>
          </div>

          <div className={styles.sizes}>
            {ALL_SIZES.map(sz => (
              <label key={sz} className={styles.sizeChip}>
                <input
                  type="checkbox"
                  checked={sizes.includes(sz)}
                  onChange={() => toggleSize(sz)}
                />
                <span>{sz}</span>
              </label>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={saving || typeof basePrice !== 'number'}
              onClick={onSave}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button className={styles.danger} onClick={onDelete}>
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
