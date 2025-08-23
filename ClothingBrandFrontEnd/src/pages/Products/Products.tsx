import React, { useEffect, useMemo, useState } from 'react';
import styles from './Products.module.css';
import { listJerseys } from '../../api/productApi';
import type { Jersey } from '../../types/seller';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useSearchParams } from 'react-router-dom';

const Products: React.FC = () => {
  const [items, setItems] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const q = params.get('q')?.toLowerCase().trim() ?? '';

  useEffect(() => {
    listJerseys().then(setItems).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter(p =>
      [p.jerseyName, p.season, p.kitVersion, p.leagueName]
        .filter(Boolean)
        .some(f => f.toLowerCase().includes(q))
    );
  }, [items, q]);

  if (loading) return <div>Loading products…</div>;

  return (
    <section>
      <h2 className={styles.h2}>Products</h2>
      {filtered.length === 0 ? (
        <div className={styles.empty}>No products yet.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
};

export default Products;
