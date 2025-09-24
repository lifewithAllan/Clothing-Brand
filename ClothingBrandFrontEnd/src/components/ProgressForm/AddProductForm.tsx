import React, { useMemo, useState } from 'react';
import styles from './AddProductForm.module.css';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { createJersey } from '../../api/productApi';
import type { CreateJerseyRequest } from '../../types/seller';
import { useNavigate } from 'react-router-dom';

const AddProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // form state collected progressively
  const [form, setForm] = useState<Partial<CreateJerseyRequest>>({
    jerseyName: '',
    season: '',
    kitVersion: 'Fan',
    sizes: [],
    descriptionPoints: [],
    frontImageUrl: '',
    sideImageUrl: '',
    backImageUrl: '',
    basePrice: undefined,
    discountedPrice: undefined,
    leagueIds: [],
  });

  const canNext = useMemo(() => {
    if (active === 0) {
      return Boolean(form.jerseyName && form.season && form.kitVersion);
    }
    if (active === 1) {
      return (form.leagueIds?.length ?? 0) > 0;
    }
    if (active === 2) {
      const hasImages = !!form.frontImageUrl && !!form.sideImageUrl && !!form.backImageUrl;
      const hasSizes = (form.sizes?.length ?? 0) > 0;
      const hasBase = typeof form.basePrice === 'number';
      return hasImages && hasSizes && hasBase;
    }
    return false;
  }, [active, form]);

  const onNext = () => setActive(s => Math.min(2, s + 1));
  const onPrev = () => setActive(s => Math.max(0, s - 1));

  const submit = async () => {
    // safe-cast since canNext already validated
    const payload = form as CreateJerseyRequest;
    await createJersey(payload);
    navigate('/app/products');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.steps}>
        <div className={`${styles.step} ${active >= 0 ? styles.done : ''} ${active === 0 ? styles.current : ''}`}>1</div>
        <div className={`${styles.step} ${active >= 1 ? styles.done : ''} ${active === 1 ? styles.current : ''}`}>2</div>
        <div className={`${styles.step} ${active >= 2 ? styles.done : ''} ${active === 2 ? styles.current : ''}`}>3</div>
      </div>

      {active === 0 && <StepOne value={form} onChange={setForm} />}
      {active === 1 && <StepTwo value={form} onChange={setForm} />}
      {active === 2 && <StepThree value={form} onChange={setForm} />}

      <div className={styles.actions}>
        <button className={styles.secondary} disabled={active === 0} onClick={onPrev}>Back</button>
        {active < 2 ? (
          <button className={styles.primary} disabled={!canNext} onClick={onNext}>Next</button>
        ) : (
          <button className={styles.primary} disabled={!canNext} onClick={submit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default AddProductForm;
