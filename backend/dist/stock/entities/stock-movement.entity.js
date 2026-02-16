"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovement = void 0;
const typeorm_1 = require("typeorm");
let StockMovement = class StockMovement {
};
exports.StockMovement = StockMovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockMovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], StockMovement.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Product'),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Object)
], StockMovement.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_from_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "locationFromId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_to_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "locationToId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_type', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "sourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "sourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lot_number', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "lotNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockMovement.prototype, "createdAt", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)('stock_movements')
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map