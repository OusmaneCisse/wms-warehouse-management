import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): Promise<import("./entities/user.entity").User>;
    create(dto: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roleId: number;
    }): Promise<import("./entities/user.entity").User>;
}
