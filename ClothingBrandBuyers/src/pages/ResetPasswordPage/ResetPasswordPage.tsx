import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './ResetPasswordPage.module.css';
import { completePasswordReset } from '../../api/authApi';

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await completePasswordReset(token, password);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Reset failed');
    }
  };

  if (!token) return <div>Invalid link</div>;

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2>Set a new password</h2>
        {submitted ? <div className={styles.success}>Password reset. You can now log in.</div> : (
          <form onSubmit={submit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <label>New password
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </label>
            <button className={styles.primary} type="submit">Reset password</button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
