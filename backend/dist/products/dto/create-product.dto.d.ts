export declare class CreateProductDto {
    sku: string;
    name: string;
    description?: string;
    barcode?: string;
    unit?: string;
    minStockQuantity?: number;
    purchasePrice?: number;
    salePrice?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    categoryId?: number;
}
