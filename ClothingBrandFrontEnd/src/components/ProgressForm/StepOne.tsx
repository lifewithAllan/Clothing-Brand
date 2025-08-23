import React from 'react';
import styles from './AddProductForm.module.css';

type Props = {
  value: any;
  onChange: (u: any) => void;
};

const StepOne: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.h3}>Basic Info</h3>

      <label className={styles.label}>
        Jersey Name
        <input
          className={styles.input}
          value={value.jerseyName ?? ''}
          onChange={(e) => onChange((s: any) => ({ ...s, jerseyName: e.target.value }))}
          placeholder="Man City Away Kit"
          required
        />
      </label>

      <label className={styles.label}>
        Season
        <input
          className={styles.input}
          value={value.season ?? ''}
          onChange={(e) => onChange((s: any) => ({ ...s, season: e.target.value }))}
          placeholder="2025/26"
          required
        />
      </label>

      <label className={styles.label}>
        Kit Version
        <select
          className={styles.input}
          value={value.kitVersion ?? 'Fan'}
          onChange={(e) => onChange((s: any) => ({ ...s, kitVersion: e.target.value }))}
        >
          <option>Fan</option>
          <option>Player</option>
          <option>Retro</option>
          <option>Special</option>
        </select>
      </label>
    </div>
  );
};

export default StepOne;
