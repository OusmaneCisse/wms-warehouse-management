# Diagramme Entité-Relation - WMS

## Schéma conceptuel

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   roles     │       │   users     │       │ audit_logs  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id PK       │───┐   │ id PK       │───┐   │ id PK       │
│ name        │   │   │ email       │   │   │ user_id FK  │
│ description │   └──>│ role_id FK  │   └──>│ action      │
└─────────────┘       │ password    │       │ entity      │
                      │ first_name  │       │ entity_id   │
                      │ last_name   │       │ old_values  │
                      └─────────────┘       │ new_values  │
                             │              └─────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐
│ categories      │  │ products    │  │ stock_movements │
├─────────────────┤  ├─────────────┤  ├─────────────────┤
│ id PK           │  │ id PK       │  │ id PK           │
│ parent_id FK ───┼──│ category_id │  │ product_id FK   │
│ name            │  │ sku         │  │ quantity        │
│ code            │  │ name        │  │ type            │
└─────────────────┘  │ barcode     │  │ location_from   │
                     │ min_stock   │  │ location_to     │
                     └──────┬──────┘  │ source_type     │
                            │         │ created_by FK   │
                            │         └─────────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   stock     │  │ warehouses      │  │ locations       │
├─────────────┤  ├─────────────────┤  ├─────────────────┤
│ product_id  │  │ id PK           │  │ id PK           │
│ location_id │  │ name            │  │ zone_id FK      │
│ quantity    │  │ code            │  │ code            │
│ lot_number  │  └────────┬────────┘  │ aisle, rack     │
└──────┬──────┘           │           │ level           │
       │                  │           │ status          │
       │                  ▼           └────────┬────────┘
       │           ┌─────────────┐             │
       │           │   zones     │             │
       │           ├─────────────┤             │
       └──────────>│ id PK       │<────────────┘
                   │ warehouse_id│
                   │ name, code  │
                   └─────────────┘

┌─────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│ suppliers   │       │ purchase_orders  │       │ purchase_order_lines│
├─────────────┤       ├──────────────────┤       ├─────────────────────┤
│ id PK       │<──────│ supplier_id FK   │──────>│ purchase_order_id   │
│ name, code  │       │ reference        │       │ product_id FK       │
│ email       │       │ order_date       │       │ quantity_ordered    │
└─────────────┘       │ status           │       │ quantity_received   │
                      └────────┬─────────┘       └─────────────────────┘
                               │
                               ▼
                      ┌──────────────────┐       ┌─────────────────────┐
                      │ goods_receipts   │       │ goods_receipt_lines │
                      ├──────────────────┤       ├─────────────────────┤
                      │ purchase_order_id│──────>│ goods_receipt_id    │
                      │ supplier_id      │       │ product_id          │
                      │ receipt_date     │       │ location_id         │
                      │ status           │       │ quantity            │
                      └──────────────────┘       └─────────────────────┘

┌─────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│ customers   │       │ sales_orders     │       │ sales_order_lines   │
├─────────────┤       ├──────────────────┤       ├─────────────────────┤
│ id PK       │<──────│ customer_id FK   │──────>│ sales_order_id      │
│ name, code  │       │ reference        │       │ product_id FK       │
│ email       │       │ order_date       │       │ quantity_ordered    │
└─────────────┘       │ status           │       │ quantity_shipped    │
                      └────────┬─────────┘       └─────────────────────┘
                               │
                               ▼
                      ┌──────────────────┐       ┌─────────────────────┐
                      │ delivery_notes   │       │ delivery_note_lines │
                      ├──────────────────┤       ├─────────────────────┤
                      │ sales_order_id   │──────>│ delivery_note_id    │
                      │ customer_id      │       │ product_id          │
                      │ delivery_date    │       │ location_id         │
                      │ status           │       │ quantity            │
                      └──────────────────┘       └─────────────────────┘
```

## Relations principales

| Relation | Type | Contraintes |
|----------|------|-------------|
| users → roles | N:1 | Chaque utilisateur a un rôle |
| products → categories | N:1 | Produit appartient à une catégorie |
| categories → categories | N:1 | Hiérarchie (parent_id) |
| stock → products | N:1 | Stock par produit |
| stock → locations | N:1 | Stock par emplacement |
| locations → zones | N:1 | Emplacement dans une zone |
| zones → warehouses | N:1 | Zone dans un entrepôt |
| stock_movements → products | N:1 | Mouvement concerne un produit |
| purchase_orders → suppliers | N:1 | Commande d'achat vers fournisseur |
| sales_orders → customers | N:1 | Commande de vente vers client |
| goods_receipts → purchase_orders | N:1 | Réception liée à une commande |
| delivery_notes → sales_orders | N:1 | Livraison liée à une commande |

## Contraintes d'intégrité

- **Unicité** : sku, barcode (products), reference (orders, receipts, movements)
- **Check** : quantity >= 0 (stock), status dans liste fermée
- **Cascade** : Suppression zone → locations, commande → lignes
- **Restrict** : Impossible de supprimer un produit avec du stock
