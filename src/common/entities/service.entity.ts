import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('services')
@Unique(['name'])
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}