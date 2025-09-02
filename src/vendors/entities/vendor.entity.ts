import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { VendorService } from './vendor-service.entity';
import { VendorCountry } from './vendor-country.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'int', nullable: true })
  response_sla_hours: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => VendorService, vendorService => vendorService.vendor)
  vendorServices: VendorService[];

  @OneToMany(() => VendorCountry, vendorCountry => vendorCountry.vendor)
  vendorCountries: VendorCountry[];
}