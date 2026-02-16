import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export interface JwtPayload {
    sub: number;
    email: string;
}
export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}
export declare class AuthService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<User | null>;
    login(email: string, password: string): Promise<AuthResponse>;
}
