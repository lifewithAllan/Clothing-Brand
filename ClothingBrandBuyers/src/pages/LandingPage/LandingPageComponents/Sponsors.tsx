// components/Sponsors/Sponsors.tsx
import React from 'react';
import styles from './Sponsors.module.css';

const Sponsors: React.FC = () => {
  const sponsors = [
    { id: 1, name: 'Nike', logo: '/logos/nike.svg' },
    { id: 2, name: 'Adidas', logo: '/logos/adidas.svg' },
    { id: 3, name: 'Puma', logo: '/logos/puma.svg' },
    { id: 4, name: 'New Balance', logo: '/logos/new-balance.svg' },
    { id: 5, name: 'Jerseybird', logo: '/logos/jerseybird.svg' },
    { id: 6, name: 'Under Amour', logo: '/logos/UnderAmour.svg' },
  ];

  return (
    <section className={styles.sponsors}>
      <h2 className={styles.sectionTitle}>Our Top Partners</h2>
      <div className={styles.logosContainer}>
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className={styles.logoItem}>
            <img 
              src={sponsor.logo} 
              alt={sponsor.name} 
              className={styles.logoImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sponsors;