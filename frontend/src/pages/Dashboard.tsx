import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import styles from './Dashboard.module.css';

interface KPI {
  totalProducts: number;
  lowStockCount: number;
  totalSuppliers: number;
  totalCustomers: number;
}

export default function Dashboard() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, lowStockRes, suppliersRes, customersRes] = await Promise.all([
          api.get('/products', { params: { limit: 1, page: 1 } }),
          api.get('/stock/low-stock'),
          api.get('/suppliers', { params: { limit: 1 } }),
          api.get('/customers', { params: { limit: 1 } }),
        ]);
        const total = productsRes.data?.total ?? 0;
        const lowStock = Array.isArray(lowStockRes.data) ? lowStockRes.data.length : 0;
        const totalSuppliers = suppliersRes.data?.total ?? 0;
        const totalCustomers = customersRes.data?.total ?? 0;
        setKpi({
          totalProducts: total,
          lowStockCount: lowStock,
          totalSuppliers,
          totalCustomers,
        });
      } catch {
        setKpi({ totalProducts: 0, lowStockCount: 0, totalSuppliers: 0, totalCustomers: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div>
      <h1 className={styles.title}>Tableau de bord</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.label}>Produits</span>
          <span className={styles.value}>{kpi?.totalProducts ?? 0}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Produits en rupture</span>
          <span className={`${styles.value} ${(kpi?.lowStockCount ?? 0) > 0 ? styles.danger : ''}`}>
            {kpi?.lowStockCount ?? 0}
          </span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Fournisseurs</span>
          <span className={styles.value}>{kpi?.totalSuppliers ?? 0}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Clients</span>
          <span className={styles.value}>{kpi?.totalCustomers ?? 0}</span>
        </div>
      </div>
      <div className={styles.section}>
        <h2>Accès rapide</h2>
        <div className={styles.links}>
          <Link to="/products" className={styles.linkCard}>Gérer les produits</Link>
          <Link to="/stock" className={styles.linkCard}>Stock & mouvements</Link>
          <Link to="/categories" className={styles.linkCard}>Catégories</Link>
          <Link to="/suppliers" className={styles.linkCard}>Fournisseurs</Link>
          <Link to="/customers" className={styles.linkCard}>Clients</Link>
          <Link to="/warehouses" className={styles.linkCard}>Entrepôts</Link>
        </div>
      </div>
    </div>
  );
}
