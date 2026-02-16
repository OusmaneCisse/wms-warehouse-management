import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './SuppliersPage.module.css';

interface Supplier {
  id: number;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState<number | undefined>();

  const load = () => {
    setLoading(true);
    api.get('/suppliers', { params: { page, limit: 20, search: search || undefined } })
      .then((r) => { setSuppliers(r.data.data ?? []); setTotal(r.data.total ?? 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      api.patch(`/suppliers/${editingId}`, form).then(() => { setShowForm(false); setEditingId(undefined); load(); });
    } else {
      api.post('/suppliers', form).then(() => { setShowForm(false); setForm({ name: '', code: '', email: '', phone: '' }); load(); });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Fournisseurs</h1>
        <button className={styles.btnAdd} onClick={() => { setEditingId(undefined); setForm({ name: '', code: '', email: '', phone: '' }); setShowForm(true); }}>
          + Nouveau fournisseur
        </button>
      </div>
      <input type="search" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={styles.row} style={{ marginBottom: '1rem', maxWidth: 300 }} />
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Modifier' : 'Nouveau fournisseur'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.row}><label>Nom *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className={styles.row}><label>Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div className={styles.row}><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className={styles.row}><label>Téléphone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className={styles.actions}><button type="button" onClick={() => setShowForm(false)}>Annuler</button><button type="submit">Enregistrer</button></div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.tableWrap}>
        {loading ? <p className={styles.loading}>Chargement...</p> : (
          <table className={styles.table}>
            <thead><tr><th>Nom</th><th>Code</th><th>Email</th><th>Téléphone</th></tr></thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} onClick={() => { setEditingId(s.id); setForm({ name: s.name, code: s.code ?? '', email: s.email ?? '', phone: s.phone ?? '' }); setShowForm(true); }} style={{ cursor: 'pointer' }}>
                  <td>{s.name}</td><td>{s.code ?? '-'}</td><td>{s.email ?? '-'}</td><td>{s.phone ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {Math.ceil(total / 20) > 1 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Précédent</button>
          <span>{page} / {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage((p) => p + 1)}>Suivant</button>
        </div>
      )}
    </div>
  );
}
