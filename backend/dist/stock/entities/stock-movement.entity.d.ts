export declare class StockMovement {
    id: number;
    reference: string;
    type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'DAMAGED' | 'RETURN';
    productId: number;
    product: {
        id: number;
        name: string;
        sku: string;
    };
    quantity: number;
    locationFromId: number | null;
    locationToId: number | null;
    sourceType: string | null;
    sourceId: number | null;
    lotNumber: string | null;
    expiryDate: Date | null;
    notes: string | null;
    createdBy: number | null;
    createdAt: Date;
}
