import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { ProductsService } from '../products/products.service';
import { LocationsService } from '../locations/locations.service';
export declare class StockService {
    private stockRepo;
    private movementsRepo;
    private productsService;
    private locationsService;
    constructor(stockRepo: Repository<Stock>, movementsRepo: Repository<StockMovement>, productsService: ProductsService, locationsService: LocationsService);
    getStockByProduct(productId: number): Promise<{
        total: number;
        locations: Stock[];
    }>;
    getLowStockProducts(): Promise<{
        productId: number;
        current: string;
        min: string;
    }[]>;
    getMovements(productId?: number, type?: string, page?: number, limit?: number): Promise<{
        data: StockMovement[];
        total: number;
    }>;
    private generateReference;
    createMovement(dto: {
        type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT';
        productId: number;
        quantity: number;
        locationFromId?: number;
        locationToId?: number;
        notes?: string;
    }, userId?: number): Promise<StockMovement>;
}
