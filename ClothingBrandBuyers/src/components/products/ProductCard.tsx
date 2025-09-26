import React from 'react';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/product';
import { useNavigate } from 'react-router-dom';

type Props = { product: Product };

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const discounted = !!product.discountedPrice;

  return (
    <article className={styles.card} onClick={() => navigate(`/products/${product.id}`)}>
      {discounted && <div className={styles.discountBadge}>Sale</div>}
      <div className={styles.thumb}>
        <img src={product.frontImageUrl} alt={product.jerseyName} />
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{product.jerseyName}</div>
        <div className={styles.meta}>{product.season} • {product.kitVersion}-V</div>
        <div className={styles.priceRow}>
          {discounted ? (
            <>
              <span className={styles.strike}>KSh {product.basePrice.toFixed(2)}</span>
              <span className={styles.price}>KSh {Number(product.discountedPrice).toFixed(2)}</span>
            </>
          ) : (
            <span className={styles.price}>KSh {product.basePrice.toFixed(2)}</span>
          )}
        </div>
        <button className={styles.shop}>Shop Now</button>
      </div>
    </article>
  );
};

export default ProductCard;
