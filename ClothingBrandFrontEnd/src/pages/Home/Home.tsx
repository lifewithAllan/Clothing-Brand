import React from 'react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <section className={styles.card}>
      <h1 className={styles.title}>Welcome to the Seller Portal 👋</h1>
      <p className={styles.p}>Use the navigation above to manage your products and leagues.</p>
      <ul className={styles.list}>
        <li>Add Product: create jerseys with a progressive form</li>
        <li>Products: view, update price/sizes, and delete jerseys</li>
        <li>Add League: create leagues and badges</li>
        <li>Leagues: update badges, or delete leagues</li>
      </ul>
    </section>
  );
};

export default Home;
