import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private repo: Repository<Supplier>,
  ) {}

  async findAll(page = 1, limit = 20, search?: string): Promise<{ data: Supplier[]; total: number }> {
    const q = this.repo.createQueryBuilder('s').orderBy('s.name');
    if (search) q.andWhere('(s.name LIKE :s OR s.code LIKE :s)', { s: `%${search}%` });
    const [data, total] = await q.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Supplier> {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Fournisseur non trouvé');
    return s;
  }

  async create(dto: Partial<Supplier>): Promise<Supplier> {
    const s = this.repo.create(dto);
    return this.repo.save(s);
  }

  async update(id: number, dto: Partial<Supplier>): Promise<Supplier> {
    const s = await this.findOne(id);
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: number): Promise<void> {
    const s = await this.findOne(id);
    await this.repo.remove(s);
  }
}
