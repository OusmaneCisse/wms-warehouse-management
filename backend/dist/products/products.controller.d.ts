import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(page?: string, limit?: string, search?: string, status?: string, categoryId?: string): Promise<import("./products.service").PaginatedResult<import("./entities/product.entity").Product>>;
    findByBarcode(barcode: string): Promise<import("./entities/product.entity").Product | null>;
    findOne(id: number): Promise<import("./entities/product.entity").Product>;
    update(id: number, dto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: number): Promise<void>;
}
