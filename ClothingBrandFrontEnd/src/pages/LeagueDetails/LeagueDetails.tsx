import React, { useEffect, useMemo, useState } from 'react';
import styles from './LeagueDetails.module.css';
import { deleteLeague, listLeagues, updateLeagueBadges } from '../../api/leagueApi';
import type { League } from '../../types/seller';
import { useNavigate, useParams } from 'react-router-dom';

const LeagueDetails: React.FC = () => {
  const { id } = useParams();
  const lid = Number(id);
  const navigate = useNavigate();

  const [items, setItems] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLeagues().then(setItems).finally(() => setLoading(false));
  }, []);

  const league = useMemo(() => items.find(i => i.id === lid), [items, lid]);

  const [badges, setBadges] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (league) setBadges(league.badges.map(b => b.badgeName));
  }, [league]);

  const add = () => {
    if (!input.trim()) return;
    setBadges(b => [...b, input.trim()]);
    setInput('');
  };
  const remove = (idx: number) => setBadges(b => b.filter((_, i) => i !== idx));

  const onSave = async () => {
    const updated = await updateLeagueBadges(lid, badges.map(b => ({ badgeName: b })));
    setItems(list => list.map(i => i.id === lid ? updated : i));
  };

  const onDelete = async () => {
    if (!confirm('Delete this league?')) return;
    await deleteLeague(lid);
    navigate('/app/leagues');
  };

  if (loading) return <div>Loading…</div>;
  if (!league) return <div className={styles.empty}>League not found.</div>;

  return (
    <section className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.title}>{league.leagueName}</h2>
        <div className={styles.tag}>{league.fontType.replace('_',' ')}</div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.h3}>Badges</h3>
        <div className={styles.row}>
          <input className={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Badge name" />
          <button className={styles.secondary} onClick={add}>Add</button>
        </div>
        <ul className={styles.list}>
          {badges.map((b, i) => (
            <li key={`${b}-${i}`} className={styles.item}>
              <span>{b}</span>
              <button className={styles.linkBtn} onClick={() => remove(i)}>Remove</button>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={onSave}>Save Changes</button>
          <button className={styles.danger} onClick={onDelete}>Delete League</button>
        </div>
      </div>
    </section>
  );
};

export default LeagueDetails;
