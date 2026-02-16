import { WarehousesService } from './warehouses.service';
export declare class WarehousesController {
    private readonly service;
    constructor(service: WarehousesService);
    findAllWarehouses(): Promise<import("./entities/warehouse.entity").Warehouse[]>;
    findOneWarehouse(id: number): Promise<import("./entities/warehouse.entity").Warehouse>;
    createWarehouse(dto: {
        name: string;
        code: string;
        address?: string;
    }): Promise<import("./entities/warehouse.entity").Warehouse>;
    updateWarehouse(id: number, dto: Record<string, unknown>): Promise<import("./entities/warehouse.entity").Warehouse>;
    getZones(id: number): Promise<import("./entities/zone.entity").Zone[]>;
    createZone(dto: {
        warehouseId: number;
        name: string;
        code: string;
        description?: string;
    }): Promise<import("./entities/zone.entity").Zone>;
}
