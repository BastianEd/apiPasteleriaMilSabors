import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';

/**
 * Entidad 'User'.
 * Define la estructura de la tabla 'users' en la base de datos.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255, select: false })
  password: string;

  @Column('date', { name: 'fecha_nacimiento', nullable: true }) // [MEJORA]: nullable true por si el admin no tiene fecha nac.
  fechaNacimiento: Date;

  /**
   * Rol del usuario.
   * Usamos el tipo 'enum' de MySQL y el enum de TS.
   * Esto previene que se inserten roles inválidos a nivel de BD y Código.
   */
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  rol: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
