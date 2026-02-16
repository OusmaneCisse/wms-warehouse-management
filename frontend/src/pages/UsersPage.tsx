import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './UsersPage.module.css';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: { name: string };
}

interface Role {
  id: number;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', roleId: 1 });

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/users'), api.get('/roles')])
      .then(([ur, rr]) => { setUsers(ur.data ?? []); setRoles(rr.data ?? []); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/users', form).then(() => { setShowForm(false); setForm({ email: '', password: '', firstName: '', lastName: '', roleId: roles[0]?.id ?? 1 }); load(); });
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Utilisateurs</h1>
        <button className={styles.btnAdd} onClick={() => { setShowForm(true); setForm({ email: '', password: '', firstName: '', lastName: '', roleId: roles[0]?.id ?? 1 }); }}>
          + Nouvel utilisateur
        </button>
      </div>
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Nouvel utilisateur</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.row}><label>Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className={styles.row}><label>Mot de passe *</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
              <div className={styles.row}><label>Prénom *</label><input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></div>
              <div className={styles.row}><label>Nom *</label><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></div>
              <div className={styles.row}><label>Rôle</label>
                <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: parseInt(e.target.value, 10) })}>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className={styles.actions}><button type="button" onClick={() => setShowForm(false)}>Annuler</button><button type="submit">Créer</button></div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.tableWrap}>
        {loading ? <p className={styles.loading}>Chargement...</p> : (
          <table className={styles.table}>
            <thead><tr><th>Email</th><th>Nom</th><th>Rôle</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.role?.name ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
