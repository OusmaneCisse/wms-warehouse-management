# Architecture du système WMS (Warehouse Management System)

## 1. Vue d'ensemble

L'application WMS est conçue selon une architecture **three-tier** moderne et scalable :
- **Présentation** : SPA React (TypeScript)
- **Business Logic** : API REST NestJS
- **Données** : PostgreSQL + Redis (cache)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              React SPA - TypeScript / Vite                        │   │
│  │  Dashboard │ Produits │ Stock │ Commandes │ Rapports │ Admin     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY / LB                                 │
│                    (Nginx / AWS ALB / Traefik)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│   NestJS Backend     │ │   NestJS Backend     │ │   NestJS Backend     │
│   (Instance 1)       │ │   (Instance 2)       │ │   (Instance N)       │
│   Port 3000          │ │   Port 3000          │ │   Port 3000          │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│   PostgreSQL         │ │   Redis              │ │   Stockage Fichiers   │
│   (Primary)          │ │   (Cache/Session)    │ │   (S3/MinIO)          │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

---

## 2. Choix technologiques (justifiés)

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Frontend** | React + TypeScript + Vite | Écosystème mature, TypeScript pour la robustesse, Vite pour le build rapide |
| **Backend** | NestJS (Node.js) | Architecture modulaire, décorateurs, support natif TypeScript, intégration facile avec TypeORM |
| **Base de données** | PostgreSQL | ACID, JSON natif, excellent pour données transactionnelles, full-text search |
| **Cache** | Redis | Sessions JWT, cache des stocks fréquemment consultés, files de tâches |
| **Auth** | JWT + Passport | Stateless, scalable, support multi-rôles |
| **Conteneurisation** | Docker + Docker Compose | Reproducibilité, déploiement simplifié |
| **Cloud** | AWS / Azure / GCP | Scalabilité, gestion des services managés |

---

## 3. Diagramme des composants logiques

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React SPA)                              │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬──────┤
│ Dashboard   │ Products    │ Stock       │ Orders      │ Reports     │ Auth │
│ Module      │ Module      │ Module      │ Module      │ Module      │      │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴──────┘
                                        │
                                        │ Axios / Fetch API
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (NestJS API)                                 │
├────────────────────────────────────────────────────────────────────────────┤
│  AuthModule      │ UsersModule    │ ProductsModule  │ StockModule           │
│  JWT Guard       │ RBAC Guards    │ Categories      │ Movements             │
├──────────────────┼────────────────┼─────────────────┼───────────────────────┤
│  LocationsModule │ SuppliersModule│ CustomersModule │ OrdersModule          │
│  Zones/Racks     │                │                 │ Purchase/Sales        │
├──────────────────┼────────────────┼─────────────────┼───────────────────────┤
│  ReportsModule   │ AuditModule    │                                                 │
└──────────────────┴────────────────┴─────────────────┴───────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
            │ TypeORM      │   │ Redis        │   │ File Storage │
            │ (PostgreSQL) │   │ Cache        │   │ (Export PDF) │
            └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 4. Gestion des environnements

| Environnement | Usage | Base de données | URL |
|---------------|-------|-----------------|-----|
| **Development** | Développement local | PostgreSQL local / Docker | http://localhost:5173 |
| **Staging** | Tests avant prod | PostgreSQL staging | https://staging.wms.example.com |
| **Production** | Utilisateurs finaux | PostgreSQL managed | https://wms.example.com |

Fichiers de configuration :
- `.env.development`
- `.env.staging`
- `.env.production`

---

## 5. Option Microservices (évolution future)

Pour une évolution vers le microservices si le volume augmente :

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Auth        │  │ Inventory   │  │ Orders      │  │ Reports     │
│ Service     │  │ Service     │  │ Service     │  │ Service     │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            Message Queue    PostgreSQL      Redis
            (RabbitMQ/Kafka)  (per service)   (shared)
```

Pour une V1, l'architecture **monolithique modulaire** NestJS est recommandée (simplicité, déploiement unique).

---

## 6. Sécurité

- **JWT** : Access token (15 min) + Refresh token (7 jours)
- **bcrypt** : Hachage mots de passe (salt rounds: 12)
- **Helmet** : En-têtes HTTP sécurisés
- **CORS** : Origines autorisées configurables
- **Rate Limiting** : Protection brute-force
- **Validation** : class-validator sur toutes les entrées
- **Audit** : Logs des actions sensibles (create, update, delete)

---

## 7. Performance

- **Pagination** : Offset + limit sur toutes les listes (max 100 items/page)
- **Index** : Sur clés étrangères, dates, codes produit, statuts
- **Cache Redis** : Stock actuel par produit (TTL 5 min), sessions
- **Transactions** : Pour opérations multi-tables (mouvements, commandes)
- **Connection pooling** : TypeORM pool (min: 2, max: 10)
