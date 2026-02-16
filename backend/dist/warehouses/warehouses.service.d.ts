import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Zone } from './entities/zone.entity';
export declare class WarehousesService {
    private whRepo;
    private zoneRepo;
    constructor(whRepo: Repository<Warehouse>, zoneRepo: Repository<Zone>);
    findAllWarehouses(): Promise<Warehouse[]>;
    findOneWarehouse(id: number): Promise<Warehouse>;
    createWarehouse(dto: Partial<Warehouse>): Promise<Warehouse>;
    updateWarehouse(id: number, dto: Partial<Warehouse>): Promise<Warehouse>;
    getZones(warehouseId: number): Promise<Zone[]>;
    createZone(dto: {
        warehouseId: number;
        name: string;
        code: string;
        description?: string;
    }): Promise<Zone>;
}
