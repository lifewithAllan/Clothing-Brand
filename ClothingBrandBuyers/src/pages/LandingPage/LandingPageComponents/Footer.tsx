// components/Footer/Footer.tsx
import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>feelhouette</h3>
          <p className={styles.footerDescription}>
            Your ultimate destination for premium sports jerseys from all major leagues and teams.
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Support</h4>
          <ul className={styles.footerLinks}>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Connect With Us</h4>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="TikTok">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
          
          <div className={styles.newsletter}>
            <h5 className={styles.newsletterTitle}>Subscribe to our newsletter</h5>
            <div className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterButton}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} JerseyHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;