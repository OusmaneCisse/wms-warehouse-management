import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class ProductsService {
    private productsRepo;
    constructor(productsRepo: Repository<Product>);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(page?: number, limit?: number, search?: string, status?: string, categoryId?: number): Promise<PaginatedResult<Product>>;
    findOne(id: number): Promise<Product>;
    findBySku(sku: string): Promise<Product | null>;
    findByBarcode(barcode: string): Promise<Product | null>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
