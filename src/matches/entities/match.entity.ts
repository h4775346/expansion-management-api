import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('matches')
@Index(['project_id', 'vendor_id'], { unique: true })
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @Column()
  vendor_id: number;

  @Column({ type: 'float' })
  score: number;

  @CreateDateColumn()
  created_at: Date;
}