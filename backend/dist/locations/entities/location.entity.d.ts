export declare class Location {
    id: number;
    zoneId: number;
    zone: {
        id: number;
        name: string;
        code: string;
    };
    code: string;
    aisle: string | null;
    rack: string | null;
    level: string | null;
    status: string;
}
