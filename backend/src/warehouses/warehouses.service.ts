import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Zone } from './entities/zone.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private whRepo: Repository<Warehouse>,
    @InjectRepository(Zone)
    private zoneRepo: Repository<Zone>,
  ) {}

  async findAllWarehouses(): Promise<Warehouse[]> {
    return this.whRepo.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }

  async findOneWarehouse(id: number): Promise<Warehouse> {
    const w = await this.whRepo.findOne({ where: { id } });
    if (!w) throw new NotFoundException('Entrepôt non trouvé');
    return w;
  }

  async createWarehouse(dto: Partial<Warehouse>): Promise<Warehouse> {
    const w = this.whRepo.create(dto);
    return this.whRepo.save(w);
  }

  async updateWarehouse(id: number, dto: Partial<Warehouse>): Promise<Warehouse> {
    const w = await this.findOneWarehouse(id);
    Object.assign(w, dto);
    return this.whRepo.save(w);
  }

  async getZones(warehouseId: number): Promise<Zone[]> {
    return this.zoneRepo.find({ where: { warehouseId }, order: { code: 'ASC' } });
  }

  async createZone(dto: { warehouseId: number; name: string; code: string; description?: string }): Promise<Zone> {
    const z = this.zoneRepo.create(dto);
    return this.zoneRepo.save(z);
  }
}
