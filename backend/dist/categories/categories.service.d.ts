import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private repo;
    constructor(repo: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(dto: {
        name: string;
        code?: string;
        description?: string;
        parentId?: number;
    }): Promise<Category>;
    update(id: number, dto: Partial<{
        name: string;
        code: string;
        description: string;
        parentId: number;
    }>): Promise<Category>;
    remove(id: number): Promise<void>;
}
