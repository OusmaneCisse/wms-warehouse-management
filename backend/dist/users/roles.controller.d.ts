import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
export declare class RolesController {
    private repo;
    constructor(repo: Repository<Role>);
    findAll(): Promise<Role[]>;
}
