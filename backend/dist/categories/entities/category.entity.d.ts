export declare class Category {
    id: number;
    parentId: number | null;
    parent: Category | null;
    name: string;
    code: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
