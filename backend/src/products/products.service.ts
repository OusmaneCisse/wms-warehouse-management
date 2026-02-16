import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existingSku = await this.productsRepo.findOne({ where: { sku: dto.sku } });
    const existingBarcode = dto.barcode
      ? await this.productsRepo.findOne({ where: { barcode: dto.barcode } })
      : null;
    const existing = existingSku || existingBarcode;
    if (existing) {
      throw new ConflictException(
        existing.sku === dto.sku ? 'SKU déjà existant' : 'Code-barres déjà existant',
      );
    }
    const product = this.productsRepo.create(dto);
    return this.productsRepo.save(product);
  }

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
    categoryId?: number,
  ): Promise<PaginatedResult<Product>> {
    const query = this.productsRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .orderBy('p.name', 'ASC');

    if (search) {
      query.andWhere(
        '(p.name ILIKE :search OR p.sku ILIKE :search OR p.barcode ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) query.andWhere('p.status = :status', { status });
    if (categoryId) query.andWhere('p.category_id = :categoryId', { categoryId });

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Produit non trouvé');
    return product;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productsRepo.findOne({ where: { sku } });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.productsRepo.findOne({ where: { barcode } });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.sku && dto.sku !== product.sku) {
      const exists = await this.findBySku(dto.sku);
      if (exists) throw new ConflictException('SKU déjà existant');
    }
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepo.remove(product);
  }
}
