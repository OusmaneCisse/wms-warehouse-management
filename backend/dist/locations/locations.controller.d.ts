import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly service;
    constructor(service: LocationsService);
    findAll(): Promise<import("./entities/location.entity").Location[]>;
    findByZone(zoneId: number): Promise<import("./entities/location.entity").Location[]>;
    findOne(id: number): Promise<import("./entities/location.entity").Location>;
    create(dto: {
        zoneId: number;
        code: string;
        aisle?: string;
        rack?: string;
        level?: string;
    }): Promise<import("./entities/location.entity").Location>;
    update(id: number, dto: Record<string, unknown>): Promise<import("./entities/location.entity").Location>;
}
