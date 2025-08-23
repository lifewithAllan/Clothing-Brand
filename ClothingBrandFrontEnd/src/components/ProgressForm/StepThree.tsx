import React, { useState } from 'react';
import styles from './AddProductForm.module.css';

const ALL_SIZES = ['S','M','L','XL','XXL','3XL'];

type Props = {
  value: any;
  onChange: (u: any) => void;
};

const StepThree: React.FC<Props> = ({ value, onChange }) => {
  const [descItem, setDescItem] = useState('');

  const toggleSize = (sz: string) => {
    onChange((s: any) => {
      const sizes: string[] = s.sizes ?? [];
      return sizes.includes(sz)
        ? { ...s, sizes: sizes.filter(x => x !== sz) }
        : { ...s, sizes: [...sizes, sz] };
    });
  };

  const addDesc = () => {
    if (!descItem.trim()) return;
    onChange((s: any) => ({ ...s, descriptionPoints: [...(s.descriptionPoints ?? []), descItem.trim()] }));
    setDescItem('');
  };

  const removeDesc = (i: number) => {
    onChange((s: any) => ({ ...s, descriptionPoints: (s.descriptionPoints ?? []).filter((_: any, idx: number) => idx !== i) }));
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.h3}>Details & Pricing</h3>

      <div className={styles.group}>
        <div className={styles.groupLabel}>Sizes Available</div>
        <div className={styles.sizes}>
          {ALL_SIZES.map(sz => (
            <label key={sz} className={styles.sizeChip}>
              <input
                type="checkbox"
                checked={(value.sizes ?? []).includes(sz)}
                onChange={() => toggleSize(sz)}
              />
              <span>{sz}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupLabel}>Description Points</div>
        <div className={styles.descRow}>
          <input
            className={styles.input}
            value={descItem}
            onChange={(e) => setDescItem(e.target.value)}
            placeholder="e.g. Breathable fabric"
          />
          <button type="button" className={styles.secondary} onClick={addDesc}>Add</button>
        </div>
        <ul className={styles.descList}>
          {(value.descriptionPoints ?? []).map((d: string, i: number) => (
            <li key={`${d}-${i}`} className={styles.descItem}>
              <span>{d}</span>
              <button type="button" className={styles.linkBtn} onClick={() => removeDesc(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.grid}>
        <label className={styles.label}>
          Front Image URL
          <input
            className={styles.input}
            value={value.frontImageUrl ?? ''}
            onChange={(e) => onChange((s: any) => ({ ...s, frontImageUrl: e.target.value }))}
            type="url"
            placeholder="https://…/front.jpg"
            required
          />
        </label>
        <label className={styles.label}>
          Side Image URL
          <input
            className={styles.input}
            value={value.sideImageUrl ?? ''}
            onChange={(e) => onChange((s: any) => ({ ...s, sideImageUrl: e.target.value }))}
            type="url"
            placeholder="https://…/side.jpg"
            required
          />
        </label>
        <label className={styles.label}>
          Back Image URL
          <input
            className={styles.input}
            value={value.backImageUrl ?? ''}
            onChange={(e) => onChange((s: any) => ({ ...s, backImageUrl: e.target.value }))}
            type="url"
            placeholder="https://…/back.jpg"
            required
          />
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.label}>
          Base Price (KSh)
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            value={value.basePrice ?? ''}
            onChange={(e) => onChange((s: any) => ({ ...s, basePrice: e.target.value ? Number(e.target.value) : undefined }))}
            required
          />
        </label>
        <label className={styles.label}>
          Discounted Price (optional)
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            value={value.discountedPrice ?? ''}
            onChange={(e) => onChange((s: any) => ({ ...s, discountedPrice: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </label>
      </div>
    </div>
  );
};

export default StepThree;
