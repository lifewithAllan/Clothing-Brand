import React, { useEffect } from 'react';
import styles from './ModalBase.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
};

const ModalBase: React.FC<Props> = ({ open, onClose, children, ariaLabel }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-label={ariaLabel ?? 'modal'} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} aria-label="Close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default ModalBase;
