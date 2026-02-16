import { useState, useEffect } from 'react';
import { api } from '../services/api';
import styles from './StockMovementForm.module.css';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Location {
  id: number;
  code: string;
}

interface StockMovementFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TYPES = [
  { value: 'STOCK_IN', label: 'Entrée stock' },
  { value: 'STOCK_OUT', label: 'Sortie stock' },
  { value: 'TRANSFER', label: 'Transfert' },
  { value: 'ADJUSTMENT', label: 'Ajustement' },
];

export default function StockMovementForm({ onSuccess, onCancel }: StockMovementFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState({
    type: 'STOCK_IN' as 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT',
    productId: 0,
    quantity: 1,
    locationFromId: 0 as number | 0,
    locationToId: 0 as number | 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products', { params: { limit: 500 } }).then((r) => setProducts(r.data?.data ?? []));
    api.get('/locations').then((r) => setLocations(r.data ?? []));
  }, []);

  const needsFrom = form.type === 'STOCK_OUT' || form.type === 'TRANSFER';
  const needsTo = form.type === 'STOCK_IN' || form.type === 'TRANSFER' || form.type === 'ADJUSTMENT';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/stock/movements', {
        type: form.type,
        productId: form.productId,
        quantity: form.quantity,
        locationFromId: needsFrom && form.locationFromId ? form.locationFromId : undefined,
        locationToId: needsTo && form.locationToId ? form.locationToId : undefined,
        notes: form.notes || undefined,
      });
      onSuccess();
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(m || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Nouveau mouvement</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <label>Type *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <label>Produit *</label>
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: parseInt(e.target.value, 10) })}
              required
            >
              <option value={0}>— Sélectionner —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <label>Quantité *</label>
            <input
              type="number"
              min={0.0001}
              step="0.01"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          {needsFrom && (
            <div className={styles.row}>
              <label>Emplacement source *</label>
              <select
                value={form.locationFromId}
                onChange={(e) => setForm({ ...form, locationFromId: parseInt(e.target.value, 10) || 0 })}
                required={needsFrom}
              >
                <option value={0}>— Sélectionner —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.code}</option>
                ))}
              </select>
            </div>
          )}
          {needsTo && (
            <div className={styles.row}>
              <label>Emplacement cible *</label>
              <select
                value={form.locationToId}
                onChange={(e) => setForm({ ...form, locationToId: parseInt(e.target.value, 10) || 0 })}
                required={needsTo}
              >
                <option value={0}>— Sélectionner —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.code}</option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.row}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onCancel}>Annuler</button>
            <button type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
