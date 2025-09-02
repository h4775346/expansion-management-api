import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';
import { Service } from '../../common/entities/service.entity';

@Entity('vendor_services')
export class VendorService {
  @PrimaryColumn()
  vendor_id: number;

  @PrimaryColumn()
  service_id: number;

  @ManyToOne(() => Vendor, vendor => vendor.vendorServices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}