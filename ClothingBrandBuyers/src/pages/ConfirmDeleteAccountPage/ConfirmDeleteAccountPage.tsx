import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './ConfirmDeleteAccountPage.module.css';

const ConfirmDeleteAccountPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return setStatus('error');
    const confirm = async () => {
      setStatus('loading');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/buyer/account/delete/confirm?token=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error('Failed');
        setStatus('done');
        setTimeout(()=>navigate('/'), 2000);
      } catch {
        setStatus('error');
      }
    };
    confirm();
  }, [token]);

  if (status === 'loading') return <div className={styles.card}>Processing deletion…</div>;
  if (status === 'error') return <div className={styles.card}>Invalid or expired link.</div>;
  return <div className={styles.card}>Account deleted. Redirecting to home…</div>;
};

export default ConfirmDeleteAccountPage;
