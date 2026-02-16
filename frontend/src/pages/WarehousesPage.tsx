import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './WarehousesPage.module.css';

interface Warehouse {
  id: number;
  name: string;
  code: string;
}

interface Zone {
  id: number;
  name: string;
  code: string;
}

interface Location {
  id: number;
  code: string;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedWh, setSelectedWh] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<'warehouse' | 'zone' | 'location' | null>(null);
  const [form, setForm] = useState({ name: '', code: '' });

  const loadWarehouses = () => api.get('/warehouses').then((r) => setWarehouses(r.data ?? []));
  const loadZones = (whId: number) => api.get(`/warehouses/${whId}/zones`).then((r) => setZones(r.data ?? []));
  const loadLocations = (zoneId: number) => api.get(`/locations/zone/${zoneId}`).then((r) => setLocations(r.data ?? []));

  useEffect(() => { loadWarehouses(); }, []);

  useEffect(() => {
    if (selectedWh) loadZones(selectedWh);
    else setZones([]);
    setSelectedZone(null);
    setLocations([]);
  }, [selectedWh]);

  useEffect(() => {
    if (selectedZone) loadLocations(selectedZone);
    else setLocations([]);
  }, [selectedZone]);

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/warehouses', form).then(() => { setShowForm(null); setForm({ name: '', code: '' }); loadWarehouses(); });
  };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWh) return;
    api.post('/warehouses/zones', { warehouseId: selectedWh, ...form }).then(() => { setShowForm(null); setForm({ name: '', code: '' }); loadZones(selectedWh); });
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) return;
    api.post('/locations', { zoneId: selectedZone, code: form.code }).then(() => { setShowForm(null); setForm({ name: '', code: '' }); loadLocations(selectedZone); });
  };

  return (
    <div>
      <h1 className={styles.title}>Entrepôts & Emplacements</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className={styles.tableWrap} style={{ flex: 1, minWidth: 200 }}>
          <div className={styles.header}>
            <h2 style={{ fontSize: '1rem' }}>Entrepôts</h2>
            <button className={styles.btnAdd} onClick={() => { setShowForm('warehouse'); setForm({ name: '', code: '' }); }}>+ Ajouter</button>
          </div>
          {showForm === 'warehouse' && (
            <form onSubmit={handleCreateWarehouse} style={{ padding: '1rem' }}>
              <div className={styles.row}><label>Nom</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className={styles.row}><label>Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
              <button type="submit">Créer</button>
              <button type="button" onClick={() => setShowForm(null)}>Annuler</button>
            </form>
          )}
          <table className={styles.table}>
            <tbody>
              {warehouses.map((w) => (
                <tr key={w.id} onClick={() => setSelectedWh(w.id)} style={{ cursor: 'pointer', background: selectedWh === w.id ? 'var(--color-surface-hover)' : undefined }}>
                  <td>{w.name}</td><td>{w.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap} style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}>Zones {selectedWh && `(${warehouses.find(w => w.id === selectedWh)?.name})`}</h2>
          {selectedWh && (
            <>
              {showForm === 'zone' && (
                <form onSubmit={handleCreateZone} style={{ padding: '1rem' }}>
                  <div className={styles.row}><label>Nom</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className={styles.row}><label>Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
                  <button type="submit">Créer</button>
                  <button type="button" onClick={() => setShowForm(null)}>Annuler</button>
                </form>
              )}
              <div style={{ padding: '0 1rem 0.5rem' }}>
                <button className={styles.btnAdd} onClick={() => { setShowForm('zone'); setForm({ name: '', code: '' }); }}>+ Zone</button>
              </div>
            </>
          )}
          <table className={styles.table}>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id} onClick={() => setSelectedZone(z.id)} style={{ cursor: 'pointer', background: selectedZone === z.id ? 'var(--color-surface-hover)' : undefined }}>
                  <td>{z.name}</td><td>{z.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap} style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}>Emplacements {selectedZone && `(${zones.find(z => z.id === selectedZone)?.name})`}</h2>
          {selectedZone && (
            <>
              {showForm === 'location' && (
                <form onSubmit={handleCreateLocation} style={{ padding: '1rem' }}>
                  <div className={styles.row}><label>Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required placeholder="ex: A1-01" /></div>
                  <button type="submit">Créer</button>
                  <button type="button" onClick={() => setShowForm(null)}>Annuler</button>
                </form>
              )}
              <div style={{ padding: '0 1rem 0.5rem' }}>
                <button className={styles.btnAdd} onClick={() => { setShowForm('location'); setForm({ name: '', code: '' }); }}>+ Emplacement</button>
              </div>
            </>
          )}
          <table className={styles.table}>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id}><td>{loc.code}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
