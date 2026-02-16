import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: number;
    categoryId: number | null;
    category: Category | null;
    sku: string;
    name: string;
    description: string | null;
    barcode: string | null;
    unit: string;
    minStockQuantity: number;
    purchasePrice: number | null;
    salePrice: number | null;
    status: 'ACTIVE' | 'INACTIVE';
    weight: number | null;
    volume: number | null;
    createdAt: Date;
    updatedAt: Date;
}
