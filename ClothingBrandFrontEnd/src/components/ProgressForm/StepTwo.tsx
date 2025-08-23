import React, { useEffect, useState } from 'react';
import styles from './AddProductForm.module.css';
import { listLeagues } from '../../api/leagueApi';
import type { League } from '../../types/seller';

type Props = {
  value: any;
  onChange: (u: any) => void;
};

const StepTwo: React.FC<Props> = ({ value, onChange }) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLeagues().then(setLeagues).finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.card}>
      <h3 className={styles.h3}>League Selection</h3>
      {loading ? <div>Loading leagues…</div> : (
        <label className={styles.label}>
          League
          <select
            className={styles.input}
            value={value.leagueId ?? ''}
            onChange={(e) => onChange((s: any) => ({ ...s, leagueId: Number(e.target.value) }))}
          >
            <option value="" disabled>Select a league</option>
            {leagues.map(l => (
              <option key={l.id} value={l.id}>
                {l.leagueName} — {l.fontType.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
      )}
      <p className={styles.help}>
        Fonts and badges are managed under "Leagues". Here you just attach the jersey to one league (as supported by current backend).
      </p>
    </div>
  );
};

export default StepTwo;
