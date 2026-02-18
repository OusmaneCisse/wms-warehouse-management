# 🚀 Déploiement sur Vercel avec Base de Données Intégrée

## 📋 Vue d'ensemble

Ce guide explique comment déployer WMS sur Vercel avec une base de données SQLite intégrée, sans nécessiter de base de données externe.

## 🎯 Configuration Spéciale Vercel

### 1. Configuration du Backend (Serverless)

Le backend est configuré pour fonctionner en mode serverless sur Vercel avec :

- **Base de données SQLite** dans `/tmp/wms.sqlite` (persistant sur Vercel)
- **Auto-seeding** au premier démarrage
- **Variables d'environnement** pré-configurées

### 2. Configuration du Frontend

Le frontend utilise des URLs relatives pour fonctionner avec le backend déployé sur le même domaine.

## 📦 Étapes de Déploiement

### Étape 1: Préparer le code

```bash
# S'assurer que tout est commité
git add .
git commit -m "feat: configuration pour déploiement Vercel avec SQLite intégré"
git push origin main
```

### Étape 2: Déployer sur Vercel

#### Option A: Via l'interface web
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Importez le dépôt `OusmaneCisse/wms-warehouse-management`
4. Vercel détectera automatiquement la configuration

#### Option B: Via CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Étape 3: Configuration des variables d'environnement

Dans le dashboard Vercel, ajoutez ces variables si elles ne sont pas déjà présentes :

```env
NODE_ENV=production
JWT_SECRET=07b251afc73a5709d7ab6c0c33b2cc2d865b4f594ed593f1a92547f75ad83c12fb0121c314977bb7a82f23bcbf06f974238361027490b1e41aaab9bb828ca3e1
CORS_ORIGIN=https://votre-domaine.vercel.app
DB_PATH=/tmp/wms.sqlite
```

## 🔧 Fonctionnalités Techniques

### Base de Données Persistante

- **Emplacement** : `/tmp/wms.sqlite`
- **Persistance** : Vercel maintient le fichier `/tmp` entre les déploiements
- **Auto-seeding** : Données initiales créées automatiquement
- **Performance** : SQLite optimisé pour les serverless functions

### Configuration API

- **Routes** : `/api/v1/*` gérées par le serverless handler
- **CORS** : Configuré pour le domaine Vercel
- **Authentification** : JWT avec clé pré-configurée
- **Validation** : Pipes NestJS activés

### Frontend Optimisé

- **Build statique** : Généré par Vite
- **API relative** : Utilise `/api/v1` comme base URL
- **Déploiement unique** : Frontend et backend sur le même domaine

## 🎯 Avantages de cette Configuration

### ✅ Simplicité
- **Une seule plateforme** : Vercel gère tout
- **Pas de base de données externe** : SQLite intégré
- **Configuration minimale** : Variables pré-configurées

### ✅ Performance
- **Latence réduite** : Frontend et backend sur même domaine
- **Serverless scaling** : Auto-scaling automatique
- **Cache intelligent** : Vercel Edge Network

### ✅ Coût
- **Gratuit** : Dans les limites du plan gratuit Vercel
- **Pas de frais de base de données** : SQLite local
- **Maintenance réduite** : Pas d'infrastructure à gérer

## 🔍 Vérification du Déploiement

### 1. Test de l'API
```bash
# Test de santé de l'API
curl https://votre-domaine.vercel.app/api/v1/auth/login

# Doit retourner une erreur 401 (endpoint fonctionnel)
```

### 2. Test de l'application
1. Ouvrez `https://votre-domaine.vercel.app`
2. Login avec : `admin@wms.com` / `admin123`
3. Vérifiez que les pages s'affichent correctement
4. Testez l'ajout d'un fournisseur

## 🚨 Limitations et Solutions

### Limitations
- **Concurrent users** : SQLite a des limites en écriture concurrente
- **Stockage** : Limité à l'espace disponible sur `/tmp`
- **Backup** : Pas de backup automatique de la base de données

### Solutions
- **Pour production heavy** : Migrer vers PostgreSQL externe
- **Pour backup** : Ajouter un endpoint de backup/restore
- **Pour scaling** : Utiliser Vercel KV ou base externe

## 📊 Monitoring

### Logs Vercel
- **Function logs** : Disponibles dans le dashboard Vercel
- **Error tracking** : Erreurs automatiquement capturées
- **Performance** : Temps de réponse des fonctions

### Métriques clés
- **Cold starts** : Temps de démarrage des fonctions
- **API response time** : Latence des endpoints
- **Error rate** : Taux d'erreur de l'API

## 🔄 Mises à Jour

### Déploiement continu
Chaque `git push origin main` déclenche automatiquement un nouveau déploiement.

### Migration de données
- **Données préservées** : `/tmp/wms.sqlite` persiste entre déploiements
- **Schema updates** : Gérées par TypeORM `synchronize: true`
- **Seed data** : Ajoutée uniquement si base vide

## 🎉 Résultat Final

Après déploiement, vous aurez :

- **URL unique** : `https://votre-domaine.vercel.app`
- **Application complète** : Frontend + backend intégré
- **Base de données fonctionnelle** : SQLite avec données initiales
- **Zéro configuration externe** : Tout géré par Vercel

**Votre WMS est maintenant utilisable en production sans base de données externe !** 🚀
