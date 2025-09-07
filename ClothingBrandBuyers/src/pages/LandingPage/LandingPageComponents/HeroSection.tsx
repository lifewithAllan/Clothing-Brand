// components/HeroSection/HeroSection.tsx
import React from 'react';
import styles from './HeroSection.module.css';
import { useUI } from '/src/app/contexts/UIContext.tsx';

const HeroSection: React.FC = () => {

const { openSignup } = useUI();

  return (
    <section className={styles.hero}>
      <div className={styles.videoContainer}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className={styles.video}
        >
          <source src="/videos/jersey-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to feelhouette</h1>
        <p className={styles.subtitle}>Your ultimate destination for premium sports jerseys</p>
        <button className={styles.ctaButton} onClick={openSignup}>Create Account</button>
      </div>
    </section>
  );
};

export default HeroSection;