import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string;

  @Column()
  type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'DAMAGED' | 'RETURN';

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne('Product')
  @JoinColumn({ name: 'product_id' })
  product: { id: number; name: string; sku: string };

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ name: 'location_from_id', type: 'integer', nullable: true })
  locationFromId: number | null;

  @Column({ name: 'location_to_id', type: 'integer', nullable: true })
  locationToId: number | null;

  @Column({ name: 'source_type', type: 'varchar', nullable: true })
  sourceType: string | null;

  @Column({ name: 'source_id', type: 'integer', nullable: true })
  sourceId: number | null;

  @Column({ name: 'lot_number', type: 'varchar', nullable: true })
  lotNumber: string | null;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'created_by', type: 'integer', nullable: true })
  createdBy: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
