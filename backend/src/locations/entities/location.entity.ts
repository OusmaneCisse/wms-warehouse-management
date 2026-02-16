import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'zone_id', type: 'integer' })
  zoneId: number;

  @ManyToOne('Zone')
  @JoinColumn({ name: 'zone_id' })
  zone: { id: number; name: string; code: string };

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  aisle: string | null;

  @Column({ type: 'varchar', nullable: true })
  rack: string | null;

  @Column({ type: 'varchar', nullable: true })
  level: string | null;

  @Column({ default: 'AVAILABLE' })
  status: string;
}
