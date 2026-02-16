import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private repo: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.repo.find({ order: { code: 'ASC' } });
  }

  async findByZone(zoneId: number): Promise<Location[]> {
    return this.repo.find({ where: { zoneId }, order: { code: 'ASC' } });
  }

  async findOne(id: number): Promise<Location> {
    const loc = await this.repo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException('Emplacement non trouvé');
    return loc;
  }

  async create(dto: { zoneId: number; code: string; aisle?: string; rack?: string; level?: string }): Promise<Location> {
    const loc = this.repo.create(dto);
    return this.repo.save(loc);
  }

  async update(id: number, dto: Partial<Location>): Promise<Location> {
    const loc = await this.findOne(id);
    Object.assign(loc, dto);
    return this.repo.save(loc);
  }
}
