import React, { useState } from 'react';
import styles from './RequestSignup.module.css';

const RequestSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/request-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-FRONTEND-BASE-URL': import.meta.env.VITE_FRONTEND_BASE },
        body: JSON.stringify({ email }),
      });
      if (!res.ok && res.status !== 202) throw new Error('Failed to request signup');
      setSent(true);
    } catch (e: unknown) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h2 className={styles.title}>Create your account</h2>

        {sent ? (
          <div className={styles.success}>
            We’ve sent you a confirmation email. Please check your inbox to continue.
          </div>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <button className={styles.button} disabled={submitting}>
              {submitting ? 'Sending…' : 'Send confirmation'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default RequestSignup;
