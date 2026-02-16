import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Category> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Catégorie non trouvée');
    return c;
  }

  async create(dto: { name: string; code?: string; description?: string; parentId?: number }): Promise<Category> {
    const cat = this.repo.create(dto);
    return this.repo.save(cat);
  }

  async update(id: number, dto: Partial<{ name: string; code: string; description: string; parentId: number }>): Promise<Category> {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.repo.remove(cat);
  }
}
