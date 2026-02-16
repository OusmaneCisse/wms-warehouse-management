"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const stock_module_1 = require("./stock/stock.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const customers_module_1 = require("./customers/customers.module");
const warehouses_module_1 = require("./warehouses/warehouses.module");
const locations_module_1 = require("./locations/locations.module");
const database_seed_service_1 = require("./database/database-seed.service");
const databaseConfig = {
    type: 'better-sqlite3',
    database: process.env.NODE_ENV === 'production'
        ? '/tmp/wms.sqlite'
        : process.env.DB_PATH || 'data/wms.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
};
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(databaseConfig),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            stock_module_1.StockModule,
            suppliers_module_1.SuppliersModule,
            customers_module_1.CustomersModule,
            warehouses_module_1.WarehousesModule,
            locations_module_1.LocationsModule,
        ],
        providers: [database_seed_service_1.DatabaseSeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map