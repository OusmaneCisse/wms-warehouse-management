import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly service;
    constructor(service: CategoriesService);
    findAll(): Promise<import("./entities/category.entity").Category[]>;
    findOne(id: number): Promise<import("./entities/category.entity").Category>;
    create(dto: {
        name: string;
        code?: string;
        description?: string;
        parentId?: number;
    }): Promise<import("./entities/category.entity").Category>;
    update(id: number, dto: Partial<{
        name: string;
        code: string;
        description: string;
        parentId: number;
    }>): Promise<import("./entities/category.entity").Category>;
    remove(id: number): Promise<void>;
}
