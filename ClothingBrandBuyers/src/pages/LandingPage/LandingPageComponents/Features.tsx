// components/Features/Features.tsx
import React from 'react';
import styles from './Features.module.css';

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Features: React.FC = () => {
  const features: FeatureCard[] = [
    {
      id: 1,
      title: "Authentic Jerseys",
      description: "All our jerseys are 100% authentic with official licensing",
      image: "/authentic.jpg"
    },
    {
      id: 2,
      title: "Fast Shipping",
      description: "Get your jersey in 2-3 business days with our express shipping",
      image: "/fast-shipping.jpg"
    },
    {
      id: 3,
      title: "Easy Returns",
      description: "Not satisfied? Return within 30 days for a full refund",
      image: "/easy-returns.png"
    },
    {
      id: 4,
      title: "Customization",
      description: "Add your name and number to make it truly yours",
      image: "/customization.png"
    },
    {
      id: 5,
      title: "Exclusive Deals",
      description: "Get access to member-only sales and promotions",
      image: "/exclusive-deals.png"
    }
  ];

  return (
    <section className={styles.features}>
      <h2 className={styles.sectionTitle}>Why Shop With Us?</h2>
      <div className={styles.cardsContainer}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img 
                src={feature.image} 
                alt={feature.title} 
                className={styles.image}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;