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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        return this.repo.find({ relations: ['role'], order: { id: 'ASC' } });
    }
    async findOne(id) {
        const u = await this.repo.findOne({ where: { id }, relations: ['role'] });
        if (!u)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        return u;
    }
    async create(dto) {
        const existing = await this.repo.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email déjà utilisé');
        const hash = await bcrypt.hash(dto.password, 12);
        const user = this.repo.create({
            email: dto.email,
            passwordHash: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleId: dto.roleId,
        });
        return this.repo.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map