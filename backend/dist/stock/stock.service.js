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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("./entities/stock.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const products_service_1 = require("../products/products.service");
const locations_service_1 = require("../locations/locations.service");
let StockService = class StockService {
    constructor(stockRepo, movementsRepo, productsService, locationsService) {
        this.stockRepo = stockRepo;
        this.movementsRepo = movementsRepo;
        this.productsService = productsService;
        this.locationsService = locationsService;
    }
    async getStockByProduct(productId) {
        await this.productsService.findOne(productId);
        const locations = await this.stockRepo.find({
            where: { productId },
            relations: ['location'],
        });
        const total = locations.reduce((sum, s) => sum + Number(s.quantity), 0);
        return { total, locations };
    }
    async getLowStockProducts() {
        const result = await this.stockRepo
            .createQueryBuilder('s')
            .select('s.product_id', 'productId')
            .addSelect('SUM(s.quantity)', 'current')
            .innerJoin('products', 'p', 'p.id = s.product_id')
            .addSelect('p.min_stock_quantity', 'min')
            .where('p.status = :status', { status: 'ACTIVE' })
            .groupBy('s.product_id')
            .addGroupBy('p.min_stock_quantity')
            .having('SUM(s.quantity) < p.min_stock_quantity')
            .getRawMany();
        return result.map((r) => ({ ...r, current: String(r.current ?? 0), min: String(r.min ?? 0) }));
    }
    async getMovements(productId, type, page = 1, limit = 20) {
        const query = this.movementsRepo.createQueryBuilder('m')
            .leftJoinAndSelect('m.product', 'p')
            .orderBy('m.created_at', 'DESC');
        if (productId)
            query.andWhere('m.product_id = :productId', { productId });
        if (type)
            query.andWhere('m.type = :type', { type });
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { data, total };
    }
    generateReference() {
        return `MOV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }
    async createMovement(dto, userId) {
        await this.productsService.findOne(dto.productId);
        if (dto.type === 'STOCK_IN' && dto.locationToId) {
            await this.locationsService.findOne(dto.locationToId);
            let stock = await this.stockRepo.findOne({
                where: { productId: dto.productId, locationId: dto.locationToId },
            });
            if (!stock) {
                stock = this.stockRepo.create({
                    productId: dto.productId,
                    locationId: dto.locationToId,
                    quantity: 0,
                });
                await this.stockRepo.save(stock);
            }
            stock.quantity = Number(stock.quantity) + dto.quantity;
            await this.stockRepo.save(stock);
        }
        else if (dto.type === 'STOCK_OUT' && dto.locationFromId) {
            await this.locationsService.findOne(dto.locationFromId);
            const stock = await this.stockRepo.findOne({
                where: { productId: dto.productId, locationId: dto.locationFromId },
            });
            if (!stock || Number(stock.quantity) < dto.quantity) {
                throw new common_1.BadRequestException('Stock insuffisant');
            }
            stock.quantity = Number(stock.quantity) - dto.quantity;
            await this.stockRepo.save(stock);
        }
        else if (dto.type === 'TRANSFER' && dto.locationFromId && dto.locationToId) {
            await this.locationsService.findOne(dto.locationFromId);
            await this.locationsService.findOne(dto.locationToId);
            const fromStock = await this.stockRepo.findOne({
                where: { productId: dto.productId, locationId: dto.locationFromId },
            });
            if (!fromStock || Number(fromStock.quantity) < dto.quantity) {
                throw new common_1.BadRequestException('Stock insuffisant à l\'emplacement source');
            }
            fromStock.quantity = Number(fromStock.quantity) - dto.quantity;
            await this.stockRepo.save(fromStock);
            let toStock = await this.stockRepo.findOne({
                where: { productId: dto.productId, locationId: dto.locationToId },
            });
            if (!toStock) {
                toStock = this.stockRepo.create({
                    productId: dto.productId,
                    locationId: dto.locationToId,
                    quantity: 0,
                });
                await this.stockRepo.save(toStock);
            }
            toStock.quantity = Number(toStock.quantity) + dto.quantity;
            await this.stockRepo.save(toStock);
        }
        else if (dto.type === 'ADJUSTMENT' && dto.locationToId) {
            await this.locationsService.findOne(dto.locationToId);
            let stock = await this.stockRepo.findOne({
                where: { productId: dto.productId, locationId: dto.locationToId },
            });
            if (!stock) {
                stock = this.stockRepo.create({
                    productId: dto.productId,
                    locationId: dto.locationToId,
                    quantity: 0,
                });
                await this.stockRepo.save(stock);
            }
            stock.quantity = dto.quantity;
            await this.stockRepo.save(stock);
        }
        const mov = this.movementsRepo.create({
            reference: this.generateReference(),
            type: dto.type,
            productId: dto.productId,
            quantity: dto.quantity,
            locationFromId: dto.locationFromId ?? null,
            locationToId: dto.locationToId ?? null,
            notes: dto.notes ?? null,
            createdBy: userId ?? null,
        });
        return this.movementsRepo.save(mov);
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService,
        locations_service_1.LocationsService])
], StockService);
//# sourceMappingURL=stock.service.js.map