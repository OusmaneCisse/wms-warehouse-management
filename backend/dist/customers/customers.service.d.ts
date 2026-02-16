import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
export declare class CustomersService {
    private repo;
    constructor(repo: Repository<Customer>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Customer[];
        total: number;
    }>;
    findOne(id: number): Promise<Customer>;
    create(dto: Partial<Customer>): Promise<Customer>;
    update(id: number, dto: Partial<Customer>): Promise<Customer>;
    remove(id: number): Promise<void>;
}
