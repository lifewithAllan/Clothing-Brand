import React, { useEffect, useState } from 'react';
import BuyerNavbar from '../../components/nav/BuyerNavbar';
import HamburgerMenu from '../../components/nav/HamburgerMenu';
import ProductGrid from '../../components/products/ProductGrid';
import { listProducts } from '../../api/productApi';
import type { Product } from '../../types/product';
import styles from './ProductsPage.module.css';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loc = useLocation();
  const q = new URLSearchParams(loc.search).get('q') ?? '';

  // now pulling both isAuthenticated and isLoading from AuthContext
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // wait until auth refresh is finished
    if (authLoading) return;

    // only fetch products if the user is authenticated
    if (isAuthenticated) {
      setLoading(true);
      listProducts(q || undefined)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [q, authLoading, isAuthenticated]);

  return (
    <>
      <BuyerNavbar />
      <HamburgerMenu />
      <main className={styles.main}>
        <div className={styles.container}>
          <h2>Products</h2>
          {(loading || authLoading) ? (
            <div>Loading...</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>No products found</div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
    </>
  );
};

export default ProductsPage;
