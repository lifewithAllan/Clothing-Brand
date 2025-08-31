import React from 'react';
import LandingNavbar from '../../components/nav/LandingNavbar';
import styles from './LandingPage.module.css';
import { useUI } from '../../app/contexts/UIContext';
import LoginModal from '../../components/modals/LoginModal';
import SignupModal from '../../components/modals/SignupModal';
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal';

const LandingPage: React.FC = () => {
  const { openSignup } = useUI();
  return (
    <>
      <LandingNavbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <h1>Shop authentic jerseys & customize your kit</h1>
            <p>Shop official kits and personalize your name and number. Fast delivery across the country.</p>
            <div className={styles.actions}>
              <button className={styles.primary} onClick={openSignup}>Create Account</button>
            </div>
          </div>
          <img src="/logo.svg" alt="hero" className={styles.heroImg} />
        </section>

        <section className={styles.features}>
          <div className={styles.card}><h3>Authentic kits</h3><p>High-quality licensed jerseys.</p></div>
          <div className={styles.card}><h3>Custom printing</h3><p>Add names & numbers.</p></div>
          <div className={styles.card}><h3>Secure checkout</h3><p>Multiple payment options (coming soon).</p></div>
        </section>
      </main>

      {/* Modals */}
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
    </>
  );
};

export default LandingPage;
