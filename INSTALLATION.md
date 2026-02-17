# 📦 WMS - Warehouse Management System
## Guide d'Installation Complet

### 🌐 Vue d'ensemble
WMS est un système de gestion d'entrepôt moderne avec :
- **Frontend** : React 18 + TypeScript + Vite
- **Backend** : NestJS + TypeORM + SQLite/PostgreSQL
- **Authentification** : JWT
- **Thème** : Interface sombre responsive

---

## 🚀 Prérequis

### Logiciels requis
- **Node.js** : >= 18.0.0
- **npm** : >= 8.0.0
- **Git** : Dernière version

### Outils recommandés
- **VS Code** : Avec extensions TypeScript/React
- **Postman** : Pour tester les API
- **Docker** : Optionnel pour déploiement

---

## 📥 Étape 1 : Cloner le dépôt

```bash
# Cloner le dépôt
git clone https://github.com/OusmaneCisse/wms-warehouse-management.git

# Entrer dans le répertoire
cd wms-warehouse-management
```

---

## 🔧 Étape 2 : Installation du Backend

### 2.1 Installation des dépendances
```bash
# Entrer dans le dossier backend
cd backend

# Installer les dépendances
npm install
```

### 2.2 Configuration des variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env  # ou utiliser votre éditeur préféré
```

**Variables d'environnement obligatoires :**
```env
# JWT Secret (générer une clé sécurisée)
JWT_SECRET=07b251afc73a5709d7ab6c0c33b2cc2d865b4f594ed593f1a92547f75ad83c12fb0121c314977bb7a82f23bcbf06f974238361027490b1e41aaab9bb828ca3e1

# Base de données
DB_PATH=data/wms.sqlite

# CORS
CORS_ORIGIN=http://localhost:5173

# Environnement
NODE_ENV=development
```

### 2.3 Initialisation de la base de données
```bash
# Créer le dossier de données
mkdir -p data

# Lancer le backend (créera automatiquement la base SQLite)
npm run start:dev
```

Le backend sera disponible sur : **http://localhost:3000**

---

## 🎨 Étape 3 : Installation du Frontend

### 3.1 Installation des dépendances
```bash
# Revenir au répertoire racine
cd ..

# Entrer dans le dossier frontend
cd frontend

# Installer les dépendances
npm install
```

### 3.2 Configuration des variables d'environnement
```bash
# Créer le fichier .env
touch .env

# Ajouter la configuration
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

### 3.3 Lancement du frontend
```bash
# Démarrer le serveur de développement
npm run dev
```

Le frontend sera disponible sur : **http://localhost:5173**

---

## 🔐 Étape 4 : Configuration Initiale

### 4.1 Accès à l'application
1. Ouvrez **http://localhost:5173** dans votre navigateur
2. Connectez-vous avec les identifiants par défaut :
   - **Email** : `admin@wms.com`
   - **Mot de passe** : `admin123`

### 4.2 Premiers pas
1. **Créer des catégories** : Produits, Matériaux, etc.
2. **Ajouter des fournisseurs** : Informations des partenaires
3. **Configurer les entrepôts** : Zones et emplacements
4. **Ajouter des produits** : Références et stocks

---

## 🗄️ Étape 5 : Configuration de la Base de Données

### Option 1 : SQLite (Développement)
- **Fichier** : `backend/data/wms.sqlite`
- **Avantages** : Simple, pas de configuration requise
- **Usage** : Idéal pour le développement et les petits projets

### Option 2 : PostgreSQL (Production)
```bash
# Installer PostgreSQL
# Sur Ubuntu/Debian :
sudo apt-get install postgresql postgresql-contrib

# Sur macOS :
brew install postgresql

# Créer une base de données
sudo -u postgres createdb wms_db

# Modifier .env pour utiliser PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/wms_db
```

---

## 🐳 Étape 6 : Docker (Optionnel)

### 6.1 Avec Docker Compose
```bash
# Lancer tous les services
docker-compose up -d

# Arrêter les services
docker-compose down
```

### 6.2 Services inclus
- **Frontend** : Port 5173
- **Backend** : Port 3000
- **PostgreSQL** : Port 5432
- **Redis** : Port 6379

---

## 🚀 Étape 7 : Déploiement

### 7.1 Frontend sur Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### 7.2 Backend sur Railway
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter et déployer
railway login
railway up
```

### 7.3 Variables d'environnement de production
```env
# Pour Vercel (frontend)
VITE_API_URL=https://votre-backend-url.railway.app/api/v1

# Pour Railway (backend)
JWT_SECRET=votre-clé-secrète-production
DATABASE_URL=postgresql://user:pass@host:5432/db
NODE_ENV=production
CORS_ORIGIN=https://votre-frontend.vercel.app
```

---

## 🛠️ Étape 8 : Développement

### 8.1 Scripts utiles
```bash
# Backend
npm run start:dev      # Développement avec hot-reload
npm run build         # Build pour production
npm run start:prod    # Lancer la version de production

# Frontend
npm run dev           # Serveur de développement
npm run build         # Build pour production
npm run preview       # Prévisualiser le build
```

### 8.2 Structure du projet
```
wms-warehouse-management/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Authentification
│   │   ├── products/       # Gestion produits
│   │   ├── suppliers/      # Gestion fournisseurs
│   │   └── ...
│   ├── data/               # Base SQLite
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── pages/          # Pages de l'application
│   │   ├── components/     # Composants réutilisables
│   │   └── services/       # Services API
│   └── package.json
├── docs/                   # Documentation
└── docker-compose.yml      # Configuration Docker
```

---

## 🔧 Étape 9 : Dépannage

### Problèmes courants

#### 9.1 "nest: not found"
```bash
# Solution : Installer @nestjs/cli en dépendance
cd backend
npm install @nestjs/cli --save
```

#### 9.2 Erreur de connexion à la base de données
```bash
# Vérifier le chemin de la base de données
ls -la backend/data/

# Recréer le dossier si nécessaire
mkdir -p backend/data
```

#### 9.3 Problème de CORS
```bash
# Vérifier les variables CORS dans .env
echo $CORS_ORIGIN
# Doit être : http://localhost:5173
```

#### 9.4 Frontend ne se connecte pas au backend
```bash
# Vérifier l'URL de l'API
cat frontend/.env
# Doit contenir : VITE_API_URL=http://localhost:3000/api/v1
```

---

## 📚 Étape 10 : Ressources

### Documentation
- **Architecture** : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Modules fonctionnels** : [docs/MODULES-FONCTIONNELS.md](docs/MODULES-FONCTIONNELS.md)
- **Schéma de la base** : [database/schema.sql](database/schema.sql)

### API Documentation
- **Swagger UI** : http://localhost:3000/api (quand le backend tourne)
- **Endpoints** : Authentification, Produits, Fournisseurs, etc.

### Support
- **Issues** : https://github.com/OusmaneCisse/wms-warehouse-management/issues
- **Discussions** : https://github.com/OusmaneCisse/wms-warehouse-management/discussions

---

## ✅ Checklist d'Installation

- [ ] Node.js >= 18.0.0 installé
- [ ] Dépôt cloné avec succès
- [ ] Backend installé et configuré
- [ ] Base de données initialisée
- [ ] Frontend installé et configuré
- [ ] Connexion frontend-backend établie
- [ ] Authentification fonctionnelle
- [ ] Pages principales accessibles
- [ ] Thème sombre appliqué
- [ ] Formulaire d'ajout fonctionnel

---

## 🎉 Félicitations !

Votre WMS est maintenant installé et prêt à l'emploi ! 

**Prochaines étapes recommandées :**
1. Explorer les différentes fonctionnalités
2. Ajouter vos propres données
3. Personnaliser l'interface si nécessaire
4. Déployer en production

Pour toute question, n'hésitez pas à consulter la documentation ou ouvrir une issue sur GitHub.
