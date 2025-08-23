import React from 'react';
import styles from './ProductCard.module.css';
import type { Jersey } from '../../types/seller';
import { useNavigate } from 'react-router-dom';

type Props = { product: Jersey };

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const discounted = product.discountedPrice !== null && product.discountedPrice !== undefined;

  return (
    <div className={styles.card} onClick={() => navigate(`/app/products/${product.id}`)}>
      <div className={styles.thumbWrap}>
        {discounted && <span className={styles.badge}>Sale</span>}
        <img src={product.frontImageUrl} alt={product.jerseyName} className={styles.thumb} />
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{product.jerseyName}</div>
        <div className={styles.meta}>
          <span>{product.season}</span> • <span>{product.kitVersion}</span>
        </div>
        <div className={styles.priceRow}>
          {discounted ? (
            <>
              <span className={styles.priceStriked}>KSh {product.basePrice.toFixed(2)}</span>
              <span className={styles.price}>KSh {Number(product.discountedPrice).toFixed(2)}</span>
            </>
          ) : (
            <span className={styles.price}>KSh {product.basePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
