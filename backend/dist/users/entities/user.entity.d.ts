export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    roleId: number;
    role: {
        id: number;
        name: string;
    };
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
