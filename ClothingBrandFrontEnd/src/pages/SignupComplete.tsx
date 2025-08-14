import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { ValidateConfirmationResponse } from '../types';
import styles from './SignupComplete.module.css';

const SignupComplete: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/validate-confirmation?token=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error('Invalid or expired link');
        const data = (await res.json()) as ValidateConfirmationResponse;
        setEmail(data.email);
      } catch (e: any) {
        setError(e.message ?? 'Failed to validate link');
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/complete-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, firstName, lastName, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? 'Failed to create account');
      }
      navigate('/login', { replace: true });
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.container}>Validating link…</div>;
  if (error) return <div className={styles.container}><div className={styles.error}>{error}</div></div>;

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h2 className={styles.title}>Finish creating your account</h2>

        <label className={styles.label}>
          Email (read-only)
          <input className={styles.input} type="email" value={email} readOnly />
        </label>

        <label className={styles.label}>
          First name
          <input className={styles.input} value={firstName} onChange={(e) => setFirst(e.target.value)} required />
        </label>

        <label className={styles.label}>
          Last name
          <input className={styles.input} value={lastName} onChange={(e) => setLast(e.target.value)} required />
        </label>

        <label className={styles.label}>
          Password
          <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <button className={styles.button} disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </div>
  );
};

export default SignupComplete;
