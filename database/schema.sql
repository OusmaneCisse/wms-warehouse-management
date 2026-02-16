-- =============================================================================
-- WMS - Warehouse Management System - Schéma de base de données
-- PostgreSQL
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Pour recherche full-text

-- =============================================================================
-- 1. RÔLES ET UTILISATEURS
-- =============================================================================

CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role_id         INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

-- =============================================================================
-- 2. AUDIT LOG
-- =============================================================================

CREATE TABLE audit_logs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE
    entity      VARCHAR(100) NOT NULL, -- products, stock_movements, etc.
    entity_id   INTEGER,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- =============================================================================
-- 3. CATÉGORIES ET PRODUITS
-- =============================================================================

CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    parent_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50) UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_parent ON categories(parent_id);

CREATE TABLE products (
    id                  SERIAL PRIMARY KEY,
    category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    sku                 VARCHAR(100) NOT NULL UNIQUE,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    barcode             VARCHAR(50) UNIQUE,
    unit                VARCHAR(20) NOT NULL DEFAULT 'PIECE',
    min_stock_quantity  DECIMAL(15, 4) DEFAULT 0,
    purchase_price      DECIMAL(15, 4),
    sale_price          DECIMAL(15, 4),
    status              VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    weight              DECIMAL(10, 4),
    volume              DECIMAL(10, 4),
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_name ON products(name);

-- =============================================================================
-- 4. ENTREPÔTS ET EMPLACEMENTS
-- =============================================================================

CREATE TABLE warehouses (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50) UNIQUE NOT NULL,
    address     VARCHAR(255),
    city        VARCHAR(100),
    postal_code VARCHAR(20),
    country     VARCHAR(100),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zones (
    id              SERIAL PRIMARY KEY,
    warehouse_id    INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    code            VARCHAR(50) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, code)
);

CREATE INDEX idx_zones_warehouse ON zones(warehouse_id);

CREATE TABLE locations (
    id              SERIAL PRIMARY KEY,
    zone_id         INTEGER NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    code            VARCHAR(50) NOT NULL,
    aisle           VARCHAR(20),
    rack            VARCHAR(20),
    level           VARCHAR(20),
    status          VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED')),
    capacity_volume DECIMAL(15, 4),
    capacity_weight DECIMAL(15, 4),
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(zone_id, code)
);

CREATE INDEX idx_locations_zone ON locations(zone_id);
CREATE INDEX idx_locations_status ON locations(status);
CREATE INDEX idx_locations_code ON locations(code);

-- =============================================================================
-- 5. STOCK
-- =============================================================================

CREATE TABLE stock (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location_id     INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    quantity        DECIMAL(15, 4) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    lot_number      VARCHAR(100),
    expiry_date     DATE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, location_id, lot_number)
);

CREATE INDEX idx_stock_product ON stock(product_id);
CREATE INDEX idx_stock_location ON stock(location_id);
CREATE INDEX idx_stock_quantity ON stock(quantity) WHERE quantity > 0;

-- Vue pour stock total par produit
CREATE VIEW v_product_stock_total AS
SELECT 
    product_id,
    SUM(quantity) AS total_quantity,
    COUNT(DISTINCT location_id) AS location_count
FROM stock
WHERE quantity > 0
GROUP BY product_id;

-- =============================================================================
-- 6. FOURNISSEURS ET CLIENTS
-- =============================================================================

CREATE TABLE suppliers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50) UNIQUE,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    address         VARCHAR(255),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100),
    tax_number      VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_code ON suppliers(code);

CREATE TABLE customers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50) UNIQUE,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    address         VARCHAR(255),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100),
    tax_number      VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_code ON customers(code);

-- =============================================================================
-- 7. COMMANDES D'ACHAT
-- =============================================================================

CREATE TABLE purchase_orders (
    id              SERIAL PRIMARY KEY,
    reference       VARCHAR(50) NOT NULL UNIQUE,
    supplier_id     INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    order_date      DATE NOT NULL,
    expected_date   DATE,
    status          VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED')),
    total_amount    DECIMAL(15, 4),
    notes           TEXT,
    created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_purchase_orders_reference ON purchase_orders(reference);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_date ON purchase_orders(order_date);

CREATE TABLE purchase_order_lines (
    id                  SERIAL PRIMARY KEY,
    purchase_order_id   INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id          INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity_ordered    DECIMAL(15, 4) NOT NULL,
    quantity_received   DECIMAL(15, 4) DEFAULT 0,
    unit_price          DECIMAL(15, 4),
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_lines_order ON purchase_order_lines(purchase_order_id);
CREATE INDEX idx_po_lines_product ON purchase_order_lines(product_id);

-- =============================================================================
-- 8. COMMANDES DE VENTE
-- =============================================================================

CREATE TABLE sales_orders (
    id              SERIAL PRIMARY KEY,
    reference       VARCHAR(50) NOT NULL UNIQUE,
    customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    order_date      DATE NOT NULL,
    expected_date   DATE,
    status          VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CONFIRMED', 'PARTIALLY_SHIPPED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    total_amount    DECIMAL(15, 4),
    notes           TEXT,
    created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_orders_reference ON sales_orders(reference);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_date ON sales_orders(order_date);

CREATE TABLE sales_order_lines (
    id                  SERIAL PRIMARY KEY,
    sales_order_id      INTEGER NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id          INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity_ordered    DECIMAL(15, 4) NOT NULL,
    quantity_shipped    DECIMAL(15, 4) DEFAULT 0,
    unit_price          DECIMAL(15, 4),
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_so_lines_order ON sales_order_lines(sales_order_id);
CREATE INDEX idx_so_lines_product ON sales_order_lines(product_id);

-- =============================================================================
-- 9. BONS DE RÉCEPTION ET LIVRAISON
-- =============================================================================

CREATE TABLE goods_receipts (
    id                  SERIAL PRIMARY KEY,
    reference           VARCHAR(50) NOT NULL UNIQUE,
    purchase_order_id   INTEGER REFERENCES purchase_orders(id) ON DELETE SET NULL,
    supplier_id         INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    receipt_date        DATE NOT NULL,
    status              VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'VALIDATED')),
    notes               TEXT,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    validated_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    validated_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gr_reference ON goods_receipts(reference);
CREATE INDEX idx_gr_purchase_order ON goods_receipts(purchase_order_id);
CREATE INDEX idx_gr_date ON goods_receipts(receipt_date);

CREATE TABLE goods_receipt_lines (
    id                  SERIAL PRIMARY KEY,
    goods_receipt_id    INTEGER NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    product_id          INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    location_id         INTEGER NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity            DECIMAL(15, 4) NOT NULL,
    lot_number          VARCHAR(100),
    expiry_date         DATE,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gr_lines_receipt ON goods_receipt_lines(goods_receipt_id);

CREATE TABLE delivery_notes (
    id                  SERIAL PRIMARY KEY,
    reference           VARCHAR(50) NOT NULL UNIQUE,
    sales_order_id      INTEGER REFERENCES sales_orders(id) ON DELETE SET NULL,
    customer_id         INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    delivery_date       DATE NOT NULL,
    status              VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'VALIDATED', 'SHIPPED')),
    notes               TEXT,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    validated_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    validated_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dn_reference ON delivery_notes(reference);
CREATE INDEX idx_dn_sales_order ON delivery_notes(sales_order_id);
CREATE INDEX idx_dn_date ON delivery_notes(delivery_date);

CREATE TABLE delivery_note_lines (
    id                  SERIAL PRIMARY KEY,
    delivery_note_id    INTEGER NOT NULL REFERENCES delivery_notes(id) ON DELETE CASCADE,
    product_id          INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    location_id         INTEGER NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity            DECIMAL(15, 4) NOT NULL,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dn_lines_note ON delivery_note_lines(delivery_note_id);

-- =============================================================================
-- 10. MOUVEMENTS DE STOCK
-- =============================================================================

CREATE TABLE stock_movements (
    id                  SERIAL PRIMARY KEY,
    reference           VARCHAR(50) NOT NULL UNIQUE,
    type                VARCHAR(30) NOT NULL CHECK (type IN ('STOCK_IN', 'STOCK_OUT', 'TRANSFER', 'ADJUSTMENT', 'DAMAGED', 'RETURN')),
    product_id          INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity            DECIMAL(15, 4) NOT NULL,
    location_from_id    INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    location_to_id      INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    source_type         VARCHAR(50),  -- GOODS_RECEIPT, DELIVERY_NOTE, MANUAL, etc.
    source_id           INTEGER,
    lot_number          VARCHAR(100),
    expiry_date         DATE,
    notes               TEXT,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(type);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_stock_movements_location_from ON stock_movements(location_from_id);
CREATE INDEX idx_stock_movements_location_to ON stock_movements(location_to_id);

-- =============================================================================
-- 11. DONNÉES INITIALES
-- =============================================================================

INSERT INTO roles (name, description) VALUES
    ('ADMIN', 'Administrateur - accès complet'),
    ('MANAGER', 'Gestionnaire - gestion produits, stock, commandes'),
    ('WAREHOUSE', 'Magasinier - réception, livraison, mouvements'),
    ('VIEWER', 'Lecture seule - consultation rapports et stock');

-- Utilisateur admin par défaut (mot de passe: Admin123!)
-- Hash bcrypt pour 'Admin123!' (à remplacer en production)
INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES
    ('admin@wms.local', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtqGJWKN7QvOu', 'Admin', 'WMS', 1);

-- Unité de mesure par défaut
-- (Les unités sont gérées en enum dans l'application: PIECE, KG, LITRE, M2, etc.)
