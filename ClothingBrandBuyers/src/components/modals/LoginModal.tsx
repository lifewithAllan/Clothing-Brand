import React, { useState } from 'react';
import ModalBase from './ModalBase';
import styles from './AuthModals.module.css';
import { useAuth } from '../../app/contexts/AuthContext';
import { useUI } from '../../app/contexts/UIContext';
import { useNavigate } from 'react-router-dom';

const LoginModal: React.FC = () => {
  const { login } = useAuth();
  const { loginOpen, closeAllModals, openSignup, openForgot } = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onClose = () => {
    closeAllModals();
    setError(null);
    setEmail(''); setPassword('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      onClose();
      navigate('/products', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalBase open={loginOpen} onClose={onClose} ariaLabel="Login form">
      <img src="/feelhouette logo.jpg" alt="logo" />
      <h2>Log in to feelhouette</h2>
      <h2>account</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={submit} className={styles.form}>
        <label>Email
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </label>
        <label>Password
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </label>
        <button className={styles.primary} type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>

      <div className={styles.footer}>
        <button className={styles.link} onClick={() => { openSignup(); }}>Don't have an account?</button>
        <button className={styles.link} onClick={() => { openForgot(); }}>Forgot password?</button>
      </div>
    </ModalBase>
  );
};

export default LoginModal;
