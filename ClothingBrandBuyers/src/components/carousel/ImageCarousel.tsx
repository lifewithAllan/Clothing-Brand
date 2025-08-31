import React, { useState } from 'react';
import styles from './ImageCarousel.module.css';

export default function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div className={styles.wrap}>
      <img src={images[idx]} alt={`${alt} ${idx+1}`} className={styles.img} />
      {images.length > 1 && (
        <>
          <button className={styles.prev} onClick={() => setIdx((idx-1+images.length)%images.length)}>‹</button>
          <button className={styles.next} onClick={() => setIdx((idx+1)%images.length)}>›</button>
          <div className={styles.dots}>
            {images.map((_, i) => <button key={i} className={`${styles.dot} ${i===idx?styles.active:''}`} onClick={()=>setIdx(i)} />)}
          </div>
        </>
      )}
    </div>
  );
}
