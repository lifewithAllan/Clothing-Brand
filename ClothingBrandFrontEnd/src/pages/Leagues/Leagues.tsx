import React, { useEffect, useMemo, useState } from 'react';
import styles from './Leagues.module.css';
import { listLeagues } from '../../api/leagueApi';
import type { League } from '../../types/seller';
import LeagueCard from '../../components/LeagueCard/LeagueCard';
import { useSearchParams } from 'react-router-dom';

const Leagues: React.FC = () => {
  const [items, setItems] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const q = params.get('q')?.toLowerCase().trim() ?? '';

  useEffect(() => {
    listLeagues().then(setItems).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter(l =>
      [l.leagueName, l.fontType, ...l.badges.map(b => b.badgeName)]
        .filter(Boolean)
        .some(f => f.toLowerCase().includes(q))
    );
  }, [items, q]);

  if (loading) return <div>Loading leagues…</div>;

  return (
    <section>
      <h2 className={styles.h2}>Leagues</h2>
      {filtered.length === 0 ? (
        <div className={styles.empty}>No leagues yet.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(l => <LeagueCard key={l.id} league={l} />)}
        </div>
      )}
    </section>
  );
};

export default Leagues;
