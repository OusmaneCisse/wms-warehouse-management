import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StockMovementForm from './StockMovementForm';
import styles from './StockPage.module.css';

interface LowStockItem {
  productId: number;
  current: string;
  min: string;
}

interface Movement {
  id: number;
  reference: string;
  type: string;
  quantity: number;
  createdAt: string;
}

export default function StockPage() {
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMovementForm, setShowMovementForm] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/stock/low-stock'),
      api.get('/stock/movements', { params: { limit: 20 } }),
    ])
      .then(([lowRes, movRes]) => {
        setLowStock(Array.isArray(lowRes.data) ? lowRes.data : []);
        setMovements(movRes.data?.data ?? []);
      })
      .catch(() => { setLowStock([]); setMovements([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div>
      {showMovementForm && (
        <StockMovementForm
          onSuccess={() => { setShowMovementForm(false); load(); }}
          onCancel={() => setShowMovementForm(false)}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className={styles.title}>Stock</h1>
        <button
          onClick={() => setShowMovementForm(true)}
          style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          + Mouvement
        </button>
      </div>
      <div className={styles.sections}>
        <section className={styles.section}>
          <h2>Produits en rupture (sous le seuil minimum)</h2>
          {lowStock.length === 0 ? (
            <p className={styles.empty}>Aucun produit en rupture.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID Produit</th>
                  <th>Stock actuel</th>
                  <th>Seuil minimum</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productId}</td>
                    <td className={styles.danger}>{item.current}</td>
                    <td>{item.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className={styles.section}>
          <h2>Derniers mouvements</h2>
          {movements.length === 0 ? (
            <p className={styles.empty}>Aucun mouvement.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Type</th>
                  <th>Quantité</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td>{m.reference}</td>
                    <td>{m.type}</td>
                    <td>{m.quantity}</td>
                    <td>{new Date(m.createdAt).toLocaleString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
