import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './ConfirmDeleteAccountPage.module.css';

const ConfirmDeleteAccountPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const navigate = useNavigate();

  // ✅ NEW: Guard to prevent double execution in React Strict Mode
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus('error');
      return;
    }

    // ✅ NEW: Check if token was already confirmed in this session
    const alreadyConfirmed = sessionStorage.getItem(`delete-confirmed-${token}`);
    if (alreadyConfirmed) {
      setStatus('done');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const confirm = async () => {
      setStatus('loading');

      // ✅ NEW: Immediately mark token as confirmed to block duplicates
      sessionStorage.setItem(`delete-confirmed-${token}`, 'true');

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/buyer/account/delete/confirm?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) throw new Error('Failed');
        setStatus('done');
        setTimeout(() => navigate('/'), 2000);
      } catch {
        // ✅ NEW: Roll back session flag if request fails
        sessionStorage.removeItem(`delete-confirmed-${token}`);
        setStatus('error');
      }
    };

    confirm();
  }, [token, navigate]);

  if (status === 'loading') return <div className={styles.card}>Processing deletion…</div>;
  if (status === 'error') return <div className={styles.card}>Invalid or expired link.</div>;
  return <div className={styles.card}>Account deleted. Redirecting to home…</div>;
};

export default ConfirmDeleteAccountPage;