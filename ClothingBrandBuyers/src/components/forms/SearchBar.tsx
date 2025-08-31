import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const q0 = params.get('q') ?? '';
  const [q, setQ] = useState(q0);

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = `/products${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`;
    navigate(url);
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <input className={styles.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search teams, kit type, season..." />
      <button className={styles.btn} type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
