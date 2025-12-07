import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad Product
 * Representa la tabla 'product' en la base de datos MySQL.
 * Nivel de documentación: Senior
 */
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  // 'int' es aceptable si manejas pesos chilenos sin centavos.
  @Column('int')
  precio: number;

  @Column('text')
  descripcion: string;

  @Column()
  imagen: string; // Guardaremos la URL o path de la imagen

  @Column({ default: false })
  destacado: boolean;
}
