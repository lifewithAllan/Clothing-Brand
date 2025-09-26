import React, { useState } from 'react';
import ModalBase from './ModalBase';
import styles from './AuthModals.module.css';
import { useUI } from '../../app/contexts/UIContext';
import { requestSignup } from '../../api/authApi';

const SignupModal: React.FC = () => {
  const { signupOpen, closeAllModals, openLogin } = useUI();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onClose = () => {
    closeAllModals();
    setEmail(''); setSent(false); setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await requestSignup({ email, frontendBase: import.meta.env.VITE_FRONTEND_BASE ?? 'http://localhost:5173' });
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to send signup email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalBase open={signupOpen} onClose={onClose} ariaLabel="Signup form">
      <img src="/feelhouette logo.jpg" alt="logo" className={styles.logo} />
      <h2>feelhouette</h2>
      <h2>Create account</h2>
      {sent ? (
        <div className={styles.info}>A confirmation link was sent to your email. Follow it to complete signup.</div>
      ) : (
        <>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={submit} className={styles.form}>
            <label>Email
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
            </label>
            <button className={styles.primary} type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send confirmation'}</button>
          </form>
          <div className={styles.footer}>
            <button className={styles.link} onClick={() => openLogin()}>Already have account?</button>
          </div>
        </>
      )}
    </ModalBase>
  );
};

export default SignupModal;
