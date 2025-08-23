import React, { useMemo, useState } from 'react';
import styles from './AddLeagueForm.module.css';
import { createLeague } from '../../api/leagueApi';
import type { CreateLeagueRequest } from '../../types/seller';
import { useNavigate } from 'react-router-dom';

const AddLeagueForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [leagueName, setLeagueName] = useState('');
  const [fontType, setFontType] = useState<'CLUB_FONT' | 'LEAGUE_FONT' | 'SPECIAL_FONT'>('LEAGUE_FONT');
  const [badges, setBadges] = useState<string[]>([]);
  const [badgeInput, setBadgeInput] = useState('');

  const canNext = useMemo(() => {
    if (step === 0) return !!leagueName && !!fontType;
    if (step === 1) return badges.length >= 0; // can be empty
    return false;
  }, [step, leagueName, fontType, badges]);

  const addBadge = () => {
    if (!badgeInput.trim()) return;
    setBadges(b => [...b, badgeInput.trim()]);
    setBadgeInput('');
  };

  const removeBadge = (idx: number) => {
    setBadges(b => b.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    const payload: CreateLeagueRequest = {
      leagueName,
      fontType,
      badges: badges.map(b => ({ badgeName: b })),
    };
    await createLeague(payload);
    navigate('/app/leagues');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.steps}>
        <div className={`${styles.step} ${step >= 0 ? styles.done : ''} ${step === 0 ? styles.current : ''}`}>1</div>
        <div className={`${styles.step} ${step >= 1 ? styles.done : ''} ${step === 1 ? styles.current : ''}`}>2</div>
      </div>

      {step === 0 && (
        <div className={styles.card}>
          <h3 className={styles.h3}>League Info</h3>
          <label className={styles.label}>
            League Name
            <input className={styles.input} value={leagueName} onChange={(e) => setLeagueName(e.target.value)} placeholder="Premier League" />
          </label>
          <label className={styles.label}>
            Font Type
            <select className={styles.input} value={fontType} onChange={(e) => setFontType(e.target.value as any)}>
              <option value="CLUB_FONT">Club Font</option>
              <option value="LEAGUE_FONT">League Font</option>
              <option value="SPECIAL_FONT">Special Font</option>
            </select>
          </label>
        </div>
      )}

      {step === 1 && (
        <div className={styles.card}>
          <h3 className={styles.h3}>Badges</h3>
          <div className={styles.row}>
            <input
              className={styles.input}
              placeholder="Add a badge (e.g. Champions patch)"
              value={badgeInput}
              onChange={(e) => setBadgeInput(e.target.value)}
            />
            <button className={styles.secondary} onClick={addBadge} type="button">Add</button>
          </div>
          <ul className={styles.list}>
            {badges.map((b, i) => (
              <li key={`${b}-${i}`} className={styles.item}>
                <span>{b}</span>
                <button className={styles.linkBtn} onClick={() => removeBadge(i)} type="button">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.secondary} disabled={step === 0} onClick={() => setStep(s => s - 1)}>Back</button>
        {step < 1 ? (
          <button className={styles.primary} disabled={!canNext} onClick={() => setStep(s => s + 1)}>Next</button>
        ) : (
          <button className={styles.primary} disabled={!canNext} onClick={submit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default AddLeagueForm;
