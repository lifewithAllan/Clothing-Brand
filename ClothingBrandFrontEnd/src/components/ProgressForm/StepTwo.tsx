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

  const toggleLeague = (id: number) => {
    onChange((s: any) => {
      const leagueIds: number[] = s.leagueIds ?? [];
      return leagueIds.includes(id)
        ? { ...s, leagueIds: leagueIds.filter(l => l !== id) }
        : { ...s, leagueIds: [...leagueIds, id] };
    });
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.h3}>League Selection</h3>
      {loading ? (
        <div>Loading leagues…</div>
      ) : (
        <div className={styles.group}>
          {leagues.map(l => (
            <label key={l.id} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={(value.leagueIds ?? []).includes(l.id)}
                onChange={() => toggleLeague(l.id)}
              />
              <span>{l.leagueName} — {l.fontType.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      )}
      <p className={styles.help}>
        You can select multiple leagues if this jersey applies to more than one.
      </p>
    </div>
  );
};

export default StepTwo;
