import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Entidad 'User'
 *
 * Esta clase representa la tabla 'users' en nuestra base de datos MySQL.
 * TypeORM usará esta definición para crear la tabla (gracias a 'synchronize: true')
 * y para realizar todas las consultas (CRUD).
 */
@Entity('users') // Especifica el nombre de la tabla en la BD
export class User {
  /**
   * Identificador único del usuario (UUID).
   * Es la clave primaria, generada automáticamente.
   */
  @PrimaryGeneratedColumn('uuid')
  id: number;

  /**
   * Nombre completo del usuario.
   */
  @Column('varchar', { length: 255 })
  nombre: string;

  /**
   * Email del usuario.
   * Debe ser único, no puede haber dos usuarios con el mismo email.
   */
  @Column('varchar', { length: 255, unique: true })
  email: string;

  /**
   * Contraseña del usuario.
   * 'select: false' es una medida de seguridad MUY IMPORTANTE.
   * Evita que la contraseña sea enviada por defecto en las consultas (ej. un findOne).
   * Tendremos que pedirla explícitamente solo cuando la necesitemos (para el login).
   */
  @Column('varchar', { length: 255, select: false })
  password: string;

  /**
   * Fecha de nacimiento del usuario, guardada como string (YYYY-MM-DD).
   */
  @Column('varchar', { length: 10 })
  fechaNacimiento: string;

  /**
   * Rol del usuario (ej: 'admin', 'client').
   * 'default: "client"' asegura que todos los nuevos usuarios sean clientes
   * a menos que se especifique lo contrario.
   */
  @Column('varchar', { length: 50, default: 'client' })
  role: string;

  /**
   * Columna especial de TypeORM.
   * Registra automáticamente la fecha y hora de creación.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Columna especial de TypeORM.
   * Registra automáticamente la fecha y hora de la última actualización.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Hook de TypeORM (@BeforeInsert).
   * Esta función se ejecutará automáticamente ANTES de que un nuevo
   * usuario sea insertado en la base de datos.
   * Usamos 'bcrypt' para "hashear" la contraseña.
   */
  @BeforeInsert()
  async hashPassword() {
    // Generamos un "salt" (aleatoriedad) y hasheamos la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  /**
   * Método de ayuda para comparar la contraseña enviada (en texto plano)
   * con la contraseña hasheada que está en la base de datos.
   * @param plainPassword - La contraseña sin hashear (ej: "123456")
   */
  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
