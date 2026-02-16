import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  async findAll(page = 1, limit = 20, search?: string): Promise<{ data: Customer[]; total: number }> {
    const q = this.repo.createQueryBuilder('c').orderBy('c.name');
    if (search) q.andWhere('(c.name LIKE :s OR c.code LIKE :s)', { s: `%${search}%` });
    const [data, total] = await q.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Customer> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Client non trouvé');
    return c;
  }

  async create(dto: Partial<Customer>): Promise<Customer> {
    const c = this.repo.create(dto);
    return this.repo.save(c);
  }

  async update(id: number, dto: Partial<Customer>): Promise<Customer> {
    const c = await this.findOne(id);
    Object.assign(c, dto);
    return this.repo.save(c);
  }

  async remove(id: number): Promise<void> {
    const c = await this.findOne(id);
    await this.repo.remove(c);
  }
}
