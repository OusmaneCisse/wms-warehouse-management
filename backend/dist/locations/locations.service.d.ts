import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
export declare class LocationsService {
    private repo;
    constructor(repo: Repository<Location>);
    findAll(): Promise<Location[]>;
    findByZone(zoneId: number): Promise<Location[]>;
    findOne(id: number): Promise<Location>;
    create(dto: {
        zoneId: number;
        code: string;
        aisle?: string;
        rack?: string;
        level?: string;
    }): Promise<Location>;
    update(id: number, dto: Partial<Location>): Promise<Location>;
}
