import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './CustomersPage.module.css';

interface Customer {
  id: number;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState<number | undefined>();

  const load = () => {
    setLoading(true);
    api.get('/customers', { params: { page, limit: 20, search: search || undefined } })
      .then((r) => { setCustomers(r.data.data ?? []); setTotal(r.data.total ?? 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      api.patch(`/customers/${editingId}`, form).then(() => { setShowForm(false); setEditingId(undefined); load(); });
    } else {
      api.post('/customers', form).then(() => { setShowForm(false); setForm({ name: '', code: '', email: '', phone: '' }); load(); });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Clients</h1>
        <button className={styles.btnAdd} onClick={() => { setEditingId(undefined); setForm({ name: '', code: '', email: '', phone: '' }); setShowForm(true); }}>
          + Nouveau client
        </button>
      </div>
      <input type="search" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ marginBottom: '1rem', maxWidth: 300, padding: '0.5rem' }} />
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Modifier' : 'Nouveau client'}</h2>
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
              {customers.map((c) => (
                <tr key={c.id} onClick={() => { setEditingId(c.id); setForm({ name: c.name, code: c.code ?? '', email: c.email ?? '', phone: c.phone ?? '' }); setShowForm(true); }} style={{ cursor: 'pointer' }}>
                  <td>{c.name}</td><td>{c.code ?? '-'}</td><td>{c.email ?? '-'}</td><td>{c.phone ?? '-'}</td>
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
