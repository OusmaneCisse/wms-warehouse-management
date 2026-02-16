# Stratégie de déploiement - WMS

## 1. Prérequis

- Node.js 18+
- Aucune base de données externe requise (SQLite intégré)

---

## 2. Développement local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

La base SQLite est créée automatiquement dans `data/wms.sqlite` au premier démarrage. Les rôles et l'utilisateur admin sont créés automatiquement.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend : http://localhost:5173
- API : http://localhost:3000/api/v1

### Compte admin par défaut

- Email : `admin@wms.local`
- Mot de passe : `Admin123!` (à changer après première connexion)

---

## 3. Production

### Build

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Variables d'environnement (production)

```env
NODE_ENV=production
DB_PATH=./data/wms.sqlite
JWT_SECRET=votre-secret-jwt-tres-long-et-aleatoire
CORS_ORIGIN=https://votre-domaine.com
```

### Lancer en production

```bash
# Backend
cd backend && node dist/main

# Frontend : servir le dossier dist/ avec un serveur web (Nginx, Apache, ou serveur statique)
```

---

## 4. Migration vers PostgreSQL (optionnel)

Pour une utilisation en production à plus grande échelle, vous pouvez migrer vers PostgreSQL en modifiant `backend/src/app.module.ts` :

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,  // Utiliser des migrations en prod
  logging: false,
}),
```

Puis exécuter le script `database/schema.sql` pour créer les tables.

---

## 5. Checklist production

- [ ] Changer JWT_SECRET
- [ ] Changer le mot de passe admin
- [ ] Activer HTTPS
- [ ] Configurer les backups de la base SQLite (copie régulière de `data/wms.sqlite`)
- [ ] CORS restreint aux domaines autorisés
