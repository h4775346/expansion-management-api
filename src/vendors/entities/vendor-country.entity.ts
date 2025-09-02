import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('vendor_countries')
export class VendorCountry {
  @PrimaryColumn()
  vendor_id: number;

  @PrimaryColumn()
  country: string;

  @ManyToOne(() => Vendor, vendor => vendor.vendorCountries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
}