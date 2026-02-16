# Déploiement sur Vercel

## 📋 Prérequis

- Compte Vercel (https://vercel.com)
- Repository GitHub/GitLab/Bitbucket avec le code
- CLI Vercel installée (optionnel)

## 🚀 Étapes de déploiement

### 1. Préparation du repository

Assurez-vous que tous les fichiers de configuration sont présents:
- ✅ `vercel.json` - Configuration du déploiement
- ✅ `package.json` - Scripts de build à la racine
- ✅ `backend/src/vercel.ts` - Handler pour serverless functions
- ✅ `.env.example` - Variables d'environnement

### 2. Connexion à Vercel

```bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter
vercel login
```

### 3. Déploiement

```bash
# Depuis la racine du projet
vercel

# Suivre les instructions:
# 1. Lier le projet au repository
# 2. Configurer les variables d'environnement
# 3. Confirmer les paramètres de déploiement
```

### 4. Configuration des variables d'environnement

Dans le dashboard Vercel, configurez ces variables:

#### Variables requises
```
NODE_ENV=production
JWT_SECRET=votre-secret-jet-très-sécurisé-ici
CORS_ORIGIN=https://votre-domaine-vercel.app
```

#### Variables optionnelles
```
VITE_API_URL=/api
DB_PATH=/tmp/wms.sqlite
```

### 5. Déploiement automatique (CI/CD)

Vercel configurera automatiquement les déploiements:
- **Production**: Sur chaque push sur `main`
- **Preview**: Sur chaque pull request

## 🔧 Configuration technique

### Architecture de déploiement

```
Frontend (React) → Static Files → CDN Vercel
     ↓
API Routes → Serverless Functions → NestJS
     ↓
Database → SQLite (temporaire) → /tmp/wms.sqlite
```

### Routes configurées

- `/*` → Frontend React
- `/api/*` → Backend NestJS (serverless)

### Limitations et considérations

1. **Base de données SQLite**: 
   - Stockée dans `/tmp` (éphémère)
   - **Recommandation**: Migrez vers PostgreSQL externe pour la production

2. **Performance**:
   - Cold start possible sur les serverless functions
   - Timeout maximum: 30 secondes

3. **Stockage**:
   - Fichiers temporaires uniquement
   - Pour le stockage persistant: utiliser AWS S3 ou similaire

## 🎯 Post-déploiement

### 1. Vérification

1. Visitez `https://votre-domaine.vercel.app`
2. Testez la connexion avec:
   - Email: `admin@wms.local`
   - Mot de passe: `Admin123!`

### 2. Monitoring

- Dashboard Vercel pour les logs et métriques
- Vercel Analytics pour le trafic
- Error tracking intégré

### 3. Améliorations recommandées

1. **Base de données**: Migration vers PostgreSQL (Vercel Postgres ou externe)
2. **Authentification**: Ajouter OAuth (Google, GitHub)
3. **Monitoring**: Intégrer Sentry pour le suivi d'erreurs
4. **Performance**: Implémenter le cache Redis

## 🐛 Dépannage

### Erreurs communes

1. **Build failed**:
   - Vérifiez les logs dans le dashboard Vercel
   - Assurez-vous que tous les imports CSS sont corrects

2. **API 404**:
   - Vérifiez la configuration dans `vercel.json`
   - Confirmez que les routes sont correctement définies

3. **CORS errors**:
   - Vérifiez la variable `CORS_ORIGIN`
   - Assurez-vous que le domaine est correct

### Logs et debugging

```bash
# Logs de déploiement
vercel logs

# Logs en temps réel
vercel logs --follow
```

## 📞 Support

- Documentation Vercel: https://vercel.com/docs
- Support: https://vercel.com/support
