import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly service;
    constructor(service: CustomersService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: import("./entities/customer.entity").Customer[];
        total: number;
    }>;
    findOne(id: number): Promise<import("./entities/customer.entity").Customer>;
    create(dto: Record<string, unknown>): Promise<import("./entities/customer.entity").Customer>;
    update(id: number, dto: Record<string, unknown>): Promise<import("./entities/customer.entity").Customer>;
    remove(id: number): Promise<void>;
}
