import { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProductForm from './ProductForm';
import styles from './ProductsPage.module.css';

interface Product {
  id: number;
  sku: string;
  name: string;
  barcode: string | null;
  unit: string;
  minStockQuantity: number;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();

  const load = () => {
    setLoading(true);
    api.get('/products', { params: { page, limit: 20, search: search || undefined } })
      .then((res) => { setProducts(res.data.data ?? []); setTotal(res.data.total ?? 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      {showForm && (
        <ProductForm
          productId={editingId}
          onSuccess={() => { setShowForm(false); setEditingId(undefined); load(); }}
          onCancel={() => { setShowForm(false); setEditingId(undefined); }}
        />
      )}
      <div className={styles.header}>
        <h1 className={styles.title}>Produits</h1>
        <button className={styles.btnAdd} onClick={() => { setEditingId(undefined); setShowForm(true); }}>
          + Nouveau produit
        </button>
        <input
          type="search"
          placeholder="Rechercher (nom, SKU, code-barres)"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className={styles.search}
        />
      </div>
      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.loading}>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nom</th>
                <th>Code-barres</th>
                <th>Unité</th>
                <th>Seuil min</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => { setEditingId(p.id); setShowForm(true); }}
                  className={styles.rowClickable}
                >
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.barcode ?? '-'}</td>
                  <td>{p.unit}</td>
                  <td>{p.minStockQuantity}</td>
                  <td>
                    <span className={p.status === 'ACTIVE' ? styles.badgeActive : styles.badgeInactive}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
