import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css'; // CSS Modules (responsive styles)

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/app', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h2 className={styles.title}>Welcome back</h2>
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

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button className={styles.button} disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <div className={styles.helper}>
          New here? <Link to="/signup/request">Create account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
