import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts') // Nombre de la tabla en la BD
export class Post {
  @PrimaryGeneratedColumn() // ID numérico autoincremental (compatible con tu controller actual)
  id: number;

  @Column('varchar', { length: 255 })
  titulo: string;

  @Column('text') // 'text' para contenido largo
  contenido: string;

  @Column('varchar', { length: 100, nullable: true })
  autor: string;

  @Column('varchar', { length: 100, nullable: true })
  categoria: string;

  @Column('varchar', { length: 500, nullable: true })
  imagen: string;

  // Fechas automáticas de auditoría
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
