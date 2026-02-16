import { useState, useEffect } from 'react';
import { api } from '../services/api';
import styles from './ProductForm.module.css';

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  productId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const UNITS = ['PIECE', 'KG', 'LITRE', 'M2', 'M', 'BOITE', 'PAQUET'];

export default function ProductForm({ productId, onSuccess, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    barcode: '',
    unit: 'PIECE',
    minStockQuantity: 0,
    purchasePrice: '',
    salePrice: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    categoryId: '' as number | '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data ?? []));
    if (productId) {
      api.get(`/products/${productId}`).then((r) => {
        const p = r.data;
        setForm({
          sku: p.sku ?? '',
          name: p.name ?? '',
          description: p.description ?? '',
          barcode: p.barcode ?? '',
          unit: p.unit ?? 'PIECE',
          minStockQuantity: p.minStockQuantity ?? 0,
          purchasePrice: p.purchasePrice ?? '',
          salePrice: p.salePrice ?? '',
          status: p.status ?? 'ACTIVE',
          categoryId: p.categoryId ?? '',
        });
      });
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || undefined,
        purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice as string) : undefined,
        salePrice: form.salePrice ? parseFloat(form.salePrice as string) : undefined,
      };
      if (productId) {
        await api.patch(`/products/${productId}`, payload);
      } else {
        await api.post('/products', payload);
      }
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
        <h2>{productId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <label>SKU *</label>
            <input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              required
            />
          </div>
          <div className={styles.row}>
            <label>Nom *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.row}>
            <label>Code-barres</label>
            <input
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            />
          </div>
          <div className={styles.row}>
            <label>Catégorie</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value ? parseInt(e.target.value, 10) : '' })}
            >
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <label>Unité</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <label>Seuil min stock</label>
            <input
              type="number"
              min={0}
              value={form.minStockQuantity}
              onChange={(e) => setForm({ ...form, minStockQuantity: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className={styles.row}>
            <label>Prix achat</label>
            <input
              type="number"
              step="0.01"
              value={form.purchasePrice}
              onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
            />
          </div>
          <div className={styles.row}>
            <label>Prix vente</label>
            <input
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            />
          </div>
          <div className={styles.row}>
            <label>Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
            >
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </div>
          <div className={styles.row}>
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onCancel}>Annuler</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
