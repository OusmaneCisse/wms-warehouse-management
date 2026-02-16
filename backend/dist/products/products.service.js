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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async create(dto) {
        const existingSku = await this.productsRepo.findOne({ where: { sku: dto.sku } });
        const existingBarcode = dto.barcode
            ? await this.productsRepo.findOne({ where: { barcode: dto.barcode } })
            : null;
        const existing = existingSku || existingBarcode;
        if (existing) {
            throw new common_1.ConflictException(existing.sku === dto.sku ? 'SKU déjà existant' : 'Code-barres déjà existant');
        }
        const product = this.productsRepo.create(dto);
        return this.productsRepo.save(product);
    }
    async findAll(page = 1, limit = 20, search, status, categoryId) {
        const query = this.productsRepo.createQueryBuilder('p')
            .leftJoinAndSelect('p.category', 'c')
            .orderBy('p.name', 'ASC');
        if (search) {
            query.andWhere('(p.name ILIKE :search OR p.sku ILIKE :search OR p.barcode ILIKE :search)', { search: `%${search}%` });
        }
        if (status)
            query.andWhere('p.status = :status', { status });
        if (categoryId)
            query.andWhere('p.category_id = :categoryId', { categoryId });
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const product = await this.productsRepo.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!product)
            throw new common_1.NotFoundException('Produit non trouvé');
        return product;
    }
    async findBySku(sku) {
        return this.productsRepo.findOne({ where: { sku } });
    }
    async findByBarcode(barcode) {
        return this.productsRepo.findOne({ where: { barcode } });
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        if (dto.sku && dto.sku !== product.sku) {
            const exists = await this.findBySku(dto.sku);
            if (exists)
                throw new common_1.ConflictException('SKU déjà existant');
        }
        Object.assign(product, dto);
        return this.productsRepo.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepo.remove(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map