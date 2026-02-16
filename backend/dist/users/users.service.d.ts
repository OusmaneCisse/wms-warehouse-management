import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(dto: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roleId: number;
    }): Promise<User>;
}
