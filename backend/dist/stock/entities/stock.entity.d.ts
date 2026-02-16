export declare class Stock {
    id: number;
    productId: number;
    product: {
        id: number;
        name: string;
        sku: string;
    };
    locationId: number;
    location: {
        id: number;
        code: string;
    } | null;
    quantity: number;
    lotNumber: string | null;
    expiryDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
