# Modules fonctionnels détaillés - WMS

## 1. 📦 Gestion des produits

### Fonctionnalités
- **CRUD complet** : Création, lecture, modification, suppression de produits
- **Catégories** : Hiérarchie de catégories (ex: Électronique > Ordinateurs > Laptops)
- **Codes-barres** : Support EAN-13, UPC, Code 128 – unicité par produit
- **Seuil d'alerte** : Champ `min_stock_quantity` – alerte si stock < seuil
- **Unité de mesure** : PIECE, KG, LITRE, M², etc.
- **Prix** : Prix d'achat, prix de vente (optionnel)
- **Statut** : ACTIF / INACTIF
- **Recherche** : Par nom, référence, code-barres, catégorie

### Entités
- `products` : id, sku, name, barcode, category_id, unit, min_stock_quantity, purchase_price, sale_price, status, created_at, updated_at
- `categories` : id, name, parent_id, description, created_at, updated_at

---

## 2. 🏢 Gestion des emplacements

### Structure hiérarchique
```
Entrepôt (Warehouse)
  └── Zone (Zone) ex: "Zone A - Réception"
        └── Allée (Aisle) ex: "Allée 01"
              └── Rack (Rack) ex: "Rack A1"
                    └── Étagère (Level) ex: "Étage 1"
                          └── Emplacement (Location) ex: "A1-01-01"
```

### Fonctionnalités
- Création des zones, allées, racks
- Code unique par emplacement (ex: `A1-01-01`)
- Capacité (optionnel) : volume max, poids max
- Statut : DISPONIBLE / OCCUPÉ / MAINTENANCE / RÉSERVÉ
- Localisation précise des produits : table `stock` avec `location_id`

### Entités
- `warehouses` : id, name, address, city, country, created_at, updated_at
- `zones` : id, warehouse_id, name, code, created_at, updated_at
- `locations` : id, zone_id, code, aisle, rack, level, status, capacity_volume, capacity_weight, created_at, updated_at

---

## 3. 📥 Gestion des entrées

### Flux
1. **Bon de réception** (GRN - Goods Receipt Note) créé
2. Ligne de réception : produit, quantité, emplacement cible
3. Validation → Création mouvement STOCK_IN
4. Mise à jour automatique du stock (`stock.quantity` + quantité)
5. Mise à jour statut commande d'achat (si lié)

### Données
- Référence unique (ex: `GRN-2024-001234`)
- Fournisseur
- Commande d'achat (optionnel)
- Date réception
- Lignes : product_id, quantity, location_id, lot_number (optionnel)
- Statut : BROUILLON / VALIDÉ

---

## 4. 📤 Gestion des sorties

### Flux
1. **Bon de livraison** (DN - Delivery Note) créé
2. Ligne de livraison : produit, quantité, emplacement source (FIFO ou choix manuel)
3. Validation → Création mouvement STOCK_OUT
4. Décrémentation automatique du stock
5. Mise à jour statut commande de vente

### Données
- Référence unique (ex: `DN-2024-001234`)
- Client
- Commande de vente (optionnel)
- Date livraison
- Lignes : product_id, quantity, location_id
- Statut : BROUILLON / VALIDÉ / EXPÉDIÉ

---

## 5. 🔄 Mouvements internes

### Types
- **TRANSFER** : Déplacement entre emplacements
- **ADJUSTMENT** : Correction de stock (inventaire)
- **DAMAGED** : Mise au rebut
- **RETURN** : Retour client

### Flux
1. Création mouvement : type, produit, quantité, location_from, location_to
2. Validation → Mise à jour stock (décrément source, incrément cible)
3. Historique complet dans `stock_movements`

### Traçabilité
- Chaque mouvement enregistre : user_id, created_at, reference, comment
- Lien vers document source (GRN, DN, PO, SO)

---

## 6. 👥 Gestion des utilisateurs

### Rôles (RBAC)
| Rôle | Permissions |
|------|-------------|
| **ADMIN** | Tout : utilisateurs, paramètres, suppression |
| **MANAGER** | Produits, stock, commandes, rapports, zones |
| **WAREHOUSE** | Réception, livraison, mouvements, consultation stock |
| **VIEWER** | Lecture seule (rapports, stock) |

### Fonctionnalités
- CRUD utilisateurs
- Attribution rôles
- Permissions granulaires par module (optionnel)
- Authentification : email + mot de passe
- Réinitialisation mot de passe
- Historique des connexions

---

## 7. 📊 Reporting

### Rapports disponibles
| Rapport | Description | Fréquence suggérée |
|---------|-------------|---------------------|
| **État du stock** | Stock actuel par produit, emplacement | Temps réel |
| **Historique mouvements** | Filtres : date, produit, type | Personnalisable |
| **Produits en rupture** | Produits < seuil min | Temps réel |
| **Valeur du stock** | Quantité × prix achat par catégorie | Quotidien |
| **Mouvements du jour** | Entrées/sorties du jour | Temps réel |
| **KPI Dashboard** | Taux rotation, taux rupture, valeur stock | Temps réel |

### Export
- PDF (rapports officiels)
- Excel/CSV (analyse)
- API pour intégration BI (Power BI, Metabase)
