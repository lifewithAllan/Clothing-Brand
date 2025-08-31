import React from 'react';
import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className={styles.grid}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};

export default ProductGrid;
