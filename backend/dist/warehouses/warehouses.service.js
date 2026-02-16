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
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const zone_entity_1 = require("./entities/zone.entity");
let WarehousesService = class WarehousesService {
    constructor(whRepo, zoneRepo) {
        this.whRepo = whRepo;
        this.zoneRepo = zoneRepo;
    }
    async findAllWarehouses() {
        return this.whRepo.find({ where: { isActive: true }, order: { name: 'ASC' } });
    }
    async findOneWarehouse(id) {
        const w = await this.whRepo.findOne({ where: { id } });
        if (!w)
            throw new common_1.NotFoundException('Entrepôt non trouvé');
        return w;
    }
    async createWarehouse(dto) {
        const w = this.whRepo.create(dto);
        return this.whRepo.save(w);
    }
    async updateWarehouse(id, dto) {
        const w = await this.findOneWarehouse(id);
        Object.assign(w, dto);
        return this.whRepo.save(w);
    }
    async getZones(warehouseId) {
        return this.zoneRepo.find({ where: { warehouseId }, order: { code: 'ASC' } });
    }
    async createZone(dto) {
        const z = this.zoneRepo.create(dto);
        return this.zoneRepo.save(z);
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(1, (0, typeorm_1.InjectRepository)(zone_entity_1.Zone)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map