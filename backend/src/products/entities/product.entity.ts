import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  barcode: string | null;

  @Column({ default: 'PIECE' })
  unit: string;

  @Column({
    name: 'min_stock_quantity',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  minStockQuantity: number;

  @Column({
    name: 'purchase_price',
    type: 'decimal',
    precision: 15,
    scale: 4,
    nullable: true,
  })
  purchasePrice: number | null;

  @Column({
    name: 'sale_price',
    type: 'decimal',
    precision: 15,
    scale: 4,
    nullable: true,
  })
  salePrice: number | null;

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  weight: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  volume: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
