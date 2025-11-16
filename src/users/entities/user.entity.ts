import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * Entidad 'User'.
 * Define la estructura de la tabla 'users' en la base de datos.
 * TypeORM usa esta clase para saber cómo mapear los datos.
 */
@Entity('users') // Nombre de la tabla en la BD
export class User {
  /**
   * Clave primaria.
   * @PrimaryGeneratedColumn le dice a TypeORM que es un ID numérico
   * que se auto-incrementa.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre del usuario.
   * Usamos @Column para definirla como una columna de texto.
   */
  @Column('varchar', { length: 100 })
  name: string;

  /**
   * Email del usuario.
   * 'unique: true' asegura que no puedan existir dos usuarios con el mismo email.
   * 'nullable: false' significa que este campo es obligatorio.
   */
  @Column('varchar', { length: 255, unique: true })
  email: string;

  /**
   * Contraseña del usuario.
   * 'nullable: false' la hace obligatoria.
   * Aquí guardaremos el HASH de la contraseña, no el texto plano.
   */
  @Column('varchar', { length: 255, select: false })
  password: string;

  /**
   * Fecha de nacimiento del usuario, guardada como string (YYYY-MM-DD).
   */
  @Column('date', { name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  /**
   * Rol del usuario.
   * 'default: 'user'' asigna este valor automáticamente si no se provee otro.
   * Útil para diferenciar administradores de clientes.
   */
  @Column({ default: 'user' })
  rol: string;

  /**
   * Fecha de creación.
   * @CreateDateColumn se actualiza automáticamente solo cuando se crea el registro.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Fecha de última actualización.
   * @UpdateDateColumn se actualiza automáticamente cada vez que se guarda (update) el registro.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Fecha de "borrado lógico" (soft delete).
   * @DeleteDateColumn se usa para el borrado suave. Cuando se llama a .softDelete(),
   * TypeORM no borra el registro, sino que pone la fecha actual en esta columna.
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
