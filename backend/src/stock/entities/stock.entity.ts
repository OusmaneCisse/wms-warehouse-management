import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne('Product')
  @JoinColumn({ name: 'product_id' })
  product: { id: number; name: string; sku: string };

  @Column({ name: 'location_id' })
  locationId: number;

  @ManyToOne('Location', { eager: false })
  @JoinColumn({ name: 'location_id' })
  location: { id: number; code: string } | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  quantity: number;

  @Column({ name: 'lot_number', type: 'varchar', nullable: true })
  lotNumber: string | null;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
