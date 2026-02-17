# WMS - Warehouse Management System

Application web de gestion d'entrepôt complète, prête pour la production.

## � Installation Rapide

### Prérequis
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation en 3 étapes
```bash
# 1. Cloner le dépôt
git clone https://github.com/OusmaneCisse/wms-warehouse-management.git
cd wms-warehouse-management

# 2. Installer le backend
cd backend
npm install
cp .env.example .env
npm run start:dev

# 3. Installer le frontend (dans un autre terminal)
cd ../frontend
npm install
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
npm run dev
```

### Accès rapide
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **Login par défaut** : admin@wms.com / admin123

---

## 📚 Documentation complète

📖 **[Guide d'installation détaillé](INSTALLATION.md)**

---

## 🌐 Déploiement en production

### Vercel (Frontend)
```bash
npm i -g vercel
vercel --prod
```

### Railway (Backend)
```bash
npm i -g @railway/cli
railway login
railway up
```

---

## �📁 Structure du projet

```
wms-warehouse-management/
├── backend/           # API NestJS
│   ├── src/
│   │   ├── auth/      # Authentification JWT
│   │   ├── users/
│   │   ├── products/
│   │   └── stock/
│   └── Dockerfile
├── frontend/          # SPA React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
│   └── Dockerfile
├── database/
│   └── schema.sql     # Schéma PostgreSQL (référence)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── MODULES-FONCTIONNELS.md
│   ├── DIAGRAMME-ER.md
│   └── DEPLOIEMENT.md
```

## 🚀 Démarrage rapide

Aucune installation de base de données externe requise (SQLite intégré).

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run start:dev

# Frontend (autre terminal)
cd frontend && npm install && npm run dev
```

- Frontend : http://localhost:5173
- API : http://localhost:3000/api/v1

### Compte admin par défaut

- **Email** : admin@wms.local
- **Mot de passe** : Admin123!

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique, diagrammes, choix technologiques |
| [MODULES-FONCTIONNELS.md](docs/MODULES-FONCTIONNELS.md) | Modules détaillés (produits, stock, entrées/sorties, etc.) |
| [DIAGRAMME-ER.md](docs/DIAGRAMME-ER.md) | Schéma entité-relation de la base |
| [DEPLOIEMENT.md](docs/DEPLOIEMENT.md) | Stratégie de déploiement, Docker, cloud |

## 🛠 Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | React 18, TypeScript, Vite |
| Backend | NestJS, TypeORM |
| Base de données | SQLite (fichier local) |
| Auth | JWT (Passport) |
| Conteneurisation | Docker, Docker Compose |

## ✅ Fonctionnalités implémentées

- [x] Authentification JWT
- [x] CRUD Produits (création, édition, catégories, codes-barres)
- [x] CRUD Catégories
- [x] CRUD Fournisseurs et Clients
- [x] Entrepôts, zones et emplacements
- [x] Gestion du stock (consultation, mouvements : entrée, sortie, transfert, ajustement)
- [x] Produits en rupture (seuil minimum)
- [x] Gestion des utilisateurs (admin)
- [x] Dashboard avec KPIs
- [x] Interface responsive

## 📋 Évolutions possibles

- Module commandes d'achat/vente
- Bons de réception et livraison
- Gestion des emplacements (zones, racks)
- Rapports PDF/Excel
- Scan code-barres
- RBAC avancé (permissions par module)
