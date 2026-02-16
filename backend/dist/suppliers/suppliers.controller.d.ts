import { SuppliersService } from './suppliers.service';
export declare class SuppliersController {
    private readonly service;
    constructor(service: SuppliersService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: import("./entities/supplier.entity").Supplier[];
        total: number;
    }>;
    findOne(id: number): Promise<import("./entities/supplier.entity").Supplier>;
    create(dto: Partial<{
        name: string;
        code: string;
        email: string;
        phone: string;
        address: string;
    }>): Promise<import("./entities/supplier.entity").Supplier>;
    update(id: number, dto: Record<string, unknown>): Promise<import("./entities/supplier.entity").Supplier>;
    remove(id: number): Promise<void>;
}
