import React, { useState } from 'react';
import styles from './ImageCarousel.module.css';

type Props = { images: string[]; alt: string };

const ImageCarousel: React.FC<Props> = ({ images, alt }) => {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className={styles.wrap}>
      <img src={images[idx]} alt={`${alt} ${idx + 1}`} className={styles.img} />
      {images.length > 1 && (
        <>
          <button className={styles.prev} onClick={prev} aria-label="Previous">‹</button>
          <button className={styles.next} onClick={next} aria-label="Next">›</button>
        </>
      )}
      <div className={styles.dots}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`${styles.dot} ${i === idx ? styles.active : ''}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
