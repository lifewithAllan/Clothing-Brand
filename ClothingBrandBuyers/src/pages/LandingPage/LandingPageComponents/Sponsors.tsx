// components/Sponsors/Sponsors.tsx
import React from 'react';
import styles from './Sponsors.module.css';

const Sponsors: React.FC = () => {
  const sponsors = [
    { id: 1, name: 'Nike', logo: '/nike.jpg' },
    { id: 2, name: 'Adidas', logo: '/adidas.jpg' },
    { id: 3, name: 'Puma', logo: '/puma.jpg' },
    { id: 4, name: 'New Balance', logo: '/new-balance.jpg' },
    { id: 5, name: 'Jerseybird', logo: '/jersey-bird.jpg' },
    { id: 6, name: 'Under Amour', logo: '/under-armour.jpg' },
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