import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { ProductsService } from '../products/products.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,
    @InjectRepository(StockMovement)
    private movementsRepo: Repository<StockMovement>,
    private productsService: ProductsService,
    private locationsService: LocationsService,
  ) {}

  async getStockByProduct(productId: number): Promise<{ total: number; locations: Stock[] }> {
    await this.productsService.findOne(productId);
    const locations = await this.stockRepo.find({
      where: { productId },
      relations: ['location'],
    });
    const total = locations.reduce((sum, s) => sum + Number(s.quantity), 0);
    return { total, locations };
  }

  async getLowStockProducts(): Promise<{ productId: number; current: string; min: string }[]> {
    const result = await this.stockRepo
      .createQueryBuilder('s')
      .select('s.product_id', 'productId')
      .addSelect('SUM(s.quantity)', 'current')
      .innerJoin('products', 'p', 'p.id = s.product_id')
      .addSelect('p.min_stock_quantity', 'min')
      .where('p.status = :status', { status: 'ACTIVE' })
      .groupBy('s.product_id')
      .addGroupBy('p.min_stock_quantity')
      .having('SUM(s.quantity) < p.min_stock_quantity')
      .getRawMany();
    return result.map((r) => ({ ...r, current: String(r.current ?? 0), min: String(r.min ?? 0) }));
  }

  async getMovements(
    productId?: number,
    type?: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: StockMovement[]; total: number }> {
    const query = this.movementsRepo.createQueryBuilder('m')
      .leftJoinAndSelect('m.product', 'p')
      .orderBy('m.created_at', 'DESC');

    if (productId) query.andWhere('m.product_id = :productId', { productId });
    if (type) query.andWhere('m.type = :type', { type });

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  private generateReference(): string {
    return `MOV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  async createMovement(
    dto: {
      type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT';
      productId: number;
      quantity: number;
      locationFromId?: number;
      locationToId?: number;
      notes?: string;
    },
    userId?: number,
  ): Promise<StockMovement> {
    await this.productsService.findOne(dto.productId);
    if (dto.type === 'STOCK_IN' && dto.locationToId) {
      await this.locationsService.findOne(dto.locationToId);
      let stock = await this.stockRepo.findOne({
        where: { productId: dto.productId, locationId: dto.locationToId },
      });
      if (!stock) {
        stock = this.stockRepo.create({
          productId: dto.productId,
          locationId: dto.locationToId,
          quantity: 0,
        });
        await this.stockRepo.save(stock);
      }
      stock.quantity = Number(stock.quantity) + dto.quantity;
      await this.stockRepo.save(stock);
    } else if (dto.type === 'STOCK_OUT' && dto.locationFromId) {
      await this.locationsService.findOne(dto.locationFromId);
      const stock = await this.stockRepo.findOne({
        where: { productId: dto.productId, locationId: dto.locationFromId },
      });
      if (!stock || Number(stock.quantity) < dto.quantity) {
        throw new BadRequestException('Stock insuffisant');
      }
      stock.quantity = Number(stock.quantity) - dto.quantity;
      await this.stockRepo.save(stock);
    } else if (dto.type === 'TRANSFER' && dto.locationFromId && dto.locationToId) {
      await this.locationsService.findOne(dto.locationFromId);
      await this.locationsService.findOne(dto.locationToId);
      const fromStock = await this.stockRepo.findOne({
        where: { productId: dto.productId, locationId: dto.locationFromId },
      });
      if (!fromStock || Number(fromStock.quantity) < dto.quantity) {
        throw new BadRequestException('Stock insuffisant à l\'emplacement source');
      }
      fromStock.quantity = Number(fromStock.quantity) - dto.quantity;
      await this.stockRepo.save(fromStock);
      let toStock = await this.stockRepo.findOne({
        where: { productId: dto.productId, locationId: dto.locationToId },
      });
      if (!toStock) {
        toStock = this.stockRepo.create({
          productId: dto.productId,
          locationId: dto.locationToId,
          quantity: 0,
        });
        await this.stockRepo.save(toStock);
      }
      toStock.quantity = Number(toStock.quantity) + dto.quantity;
      await this.stockRepo.save(toStock);
    } else if (dto.type === 'ADJUSTMENT' && dto.locationToId) {
      await this.locationsService.findOne(dto.locationToId);
      let stock = await this.stockRepo.findOne({
        where: { productId: dto.productId, locationId: dto.locationToId },
      });
      if (!stock) {
        stock = this.stockRepo.create({
          productId: dto.productId,
          locationId: dto.locationToId,
          quantity: 0,
        });
        await this.stockRepo.save(stock);
      }
      stock.quantity = dto.quantity;
      await this.stockRepo.save(stock);
    }
    const mov = this.movementsRepo.create({
      reference: this.generateReference(),
      type: dto.type,
      productId: dto.productId,
      quantity: dto.quantity,
      locationFromId: dto.locationFromId ?? null,
      locationToId: dto.locationToId ?? null,
      notes: dto.notes ?? null,
      createdBy: userId ?? null,
    });
    return this.movementsRepo.save(mov);
  }
}
