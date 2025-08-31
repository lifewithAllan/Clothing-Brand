import React, { useState } from 'react';
import ModalBase from './ModalBase';
import styles from './AuthModals.module.css';
import { useUI } from '../../app/contexts/UIContext';
import { requestPasswordReset } from '../../api/authApi';

const ForgotPasswordModal: React.FC = () => {
  const { forgotOpen, closeAllModals, openLogin } = useUI();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onClose = () => { closeAllModals(); setEmail(''); setSent(false); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalBase open={forgotOpen} onClose={onClose} ariaLabel="Forgot password">
      <img src="/feelhouette logo.jpg" alt="logo" />
      <h2>feelhouette</h2>
      <h2>Reset password</h2>
      {sent ? (
        <div className={styles.info}>If the email exists you will receive reset instructions shortly.</div>
      ) : (
        <>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={submit} className={styles.form}>
            <label>Email
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
            </label>
            <button className={styles.primary} type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send reset link'}</button>
          </form>
          <div className={styles.footer}>
            <button className={styles.link} onClick={() => openLogin()}>Back to login</button>
          </div>
        </>
      )}
    </ModalBase>
  );
};

export default ForgotPasswordModal;
