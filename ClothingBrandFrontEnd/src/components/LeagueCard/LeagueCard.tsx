import React from 'react';
import styles from './LeagueCard.module.css';
import type { League } from '../../types/seller';
import { useNavigate } from 'react-router-dom';

type Props = { league: League };

const LeagueCard: React.FC<Props> = ({ league }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.card} onClick={() => navigate(`/app/leagues/${league.id}`)}>
      <div className={styles.header}>
        <div className={styles.name}>{league.leagueName}</div>
        <div className={styles.tag}>{league.fontType.replace('_', ' ')}</div>
      </div>
      <div className={styles.badges}>
        {league.badges.slice(0, 4).map(b => (
          <span key={b.id} className={styles.badge}>{b.badgeName}</span>
        ))}
        {league.badges.length > 4 && <span className={styles.more}>+{league.badges.length - 4} more</span>}
      </div>
    </div>
  );
};

export default LeagueCard;
