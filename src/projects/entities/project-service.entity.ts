import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { Service } from '../../common/entities/service.entity';

@Entity('project_services')
export class ProjectService {
  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  service_id: number;

  @ManyToOne(() => Project, project => project.projectServices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}