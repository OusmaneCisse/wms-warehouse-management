import { StockService } from './stock.service';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    createMovement(dto: {
        type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT';
        productId: number;
        quantity: number;
        locationFromId?: number;
        locationToId?: number;
        notes?: string;
    }): Promise<import("./entities/stock-movement.entity").StockMovement>;
    getByProduct(productId: number): Promise<{
        total: number;
        locations: import("./entities/stock.entity").Stock[];
    }>;
    getLowStock(): Promise<{
        productId: number;
        current: string;
        min: string;
    }[]>;
    getMovements(productId?: string, type?: string, page?: string, limit?: string): Promise<{
        data: import("./entities/stock-movement.entity").StockMovement[];
        total: number;
    }>;
}
