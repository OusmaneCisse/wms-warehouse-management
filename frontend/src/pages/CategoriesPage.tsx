import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './CategoriesPage.module.css';

interface Category {
  id: number;
  name: string;
  code: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState<number | undefined>();

  const load = () => {
    setLoading(true);
    api.get('/categories').then((r) => setCategories(r.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      api.patch(`/categories/${editingId}`, form).then(() => { setShowForm(false); setEditingId(undefined); load(); });
    } else {
      api.post('/categories', form).then(() => { setShowForm(false); setForm({ name: '', code: '' }); load(); });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette catégorie ?')) {
      api.delete(`/categories/${id}`).then(load);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Catégories</h1>
        <button className={styles.btnAdd} onClick={() => { setEditingId(undefined); setForm({ name: '', code: '' }); setShowForm(true); }}>
          + Nouvelle catégorie
        </button>
      </div>
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Modifier' : 'Nouvelle catégorie'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.row}>
                <label>Nom *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className={styles.row}>
                <label>Code</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.tableWrap}>
        {loading ? <p className={styles.loading}>Chargement...</p> : (
          <table className={styles.table}>
            <thead>
              <tr><th>Nom</th><th>Code</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.code ?? '-'}</td>
                  <td>
                    <button className={styles.btnSm} onClick={() => { setEditingId(c.id); setForm({ name: c.name, code: c.code ?? '' }); setShowForm(true); }}>Modifier</button>
                    <button className={styles.btnSmDanger} onClick={() => handleDelete(c.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
