import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
export declare class SuppliersService {
    private repo;
    constructor(repo: Repository<Supplier>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Supplier[];
        total: number;
    }>;
    findOne(id: number): Promise<Supplier>;
    create(dto: Partial<Supplier>): Promise<Supplier>;
    update(id: number, dto: Partial<Supplier>): Promise<Supplier>;
    remove(id: number): Promise<void>;
}
