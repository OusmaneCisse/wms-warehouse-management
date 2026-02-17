import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { StockModule } from './stock/stock.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CustomersModule } from './customers/customers.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { LocationsModule } from './locations/locations.module';
import { DatabaseSeedService } from './database/database-seed.service';

const databaseConfig = {
  type: process.env.DATABASE_URL ? 'postgres' : 'better-sqlite3' as const,
  database: process.env.DATABASE_URL || (process.env.NODE_ENV === 'production' 
    ? '/tmp/wms.sqlite' 
    : process.env.DB_PATH || 'data/wms.sqlite'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    StockModule,
    SuppliersModule,
    CustomersModule,
    WarehousesModule,
    LocationsModule,
  ],
  providers: [DatabaseSeedService],
})
export class AppModule {}
