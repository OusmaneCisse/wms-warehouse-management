export declare class Zone {
    id: number;
    warehouseId: number;
    warehouse: {
        id: number;
        name: string;
    };
    name: string;
    code: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
