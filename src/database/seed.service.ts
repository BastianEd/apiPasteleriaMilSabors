import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

/**
 * SeedService
 * Encargado de la hidratación inicial de la base de datos.
 * Garantiza la existencia de usuarios críticos y de prueba definidos por negocio.
 * Nivel de documentación: Senior
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Hook de inicialización del módulo.
   * Ejecuta la lógica de sembrado al levantar la aplicación.
   */
  async onModuleInit() {
    await this.seedUsers();
  }

  /**
   * Orquesta la creación de usuarios definidos.
   * Mantiene al Admin y asegura la existencia de los 3 usuarios base requeridos.
   */
  private async seedUsers() {
    // 1. Verificar y crear Administrador del sistema
    const adminEmail = 'admin@milsabores.com';
    const adminExist = await this.userRepository.findOneBy({
      email: adminEmail,
    });

    if (!adminExist) {
      this.logger.log('Sembrando Administrador del sistema...');
      await this.createUser(
        'Admin Principal',
        adminEmail,
        'Admin123!',
        Role.ADMIN,
        new Date('1980-01-01'), // Fecha arbitraria para admin
      );
    }

    // 2. Definición de usuarios de prueba específicos
    const specificUsers = [
      {
        nombre: 'Michael Rodríguez',
        email: 'mayor@gmail.com',
        password: 'password123',
        fechaNacimiento: '1960-05-15',
      },
      {
        nombre: 'Diego Muñoz',
        email: 'estudiante@duoc.cl',
        password: 'password123',
        fechaNacimiento: '2002-08-22',
      },
      {
        nombre: 'Carmen Jiménez',
        email: 'usuario@gmail.com',
        password: 'password123',
        fechaNacimiento: '1990-12-10',
      },
    ];

    // 3. Iteración y creación segura (Idempotencia)
    for (const userData of specificUsers) {
      const userExists = await this.userRepository.findOneBy({
        email: userData.email,
      });

      if (!userExists) {
        this.logger.log(`Sembrando usuario específico: ${userData.email}...`);
        await this.createUser(
          userData.nombre,
          userData.email,
          userData.password,
          Role.USER,
          new Date(userData.fechaNacimiento),
        );
      }
    }
  }

  /**
   * Crea y persiste un usuario en la base de datos.
   * @param name Nombre completo del usuario
   * @param email Correo electrónico (debe ser único)
   * @param passPlain Contraseña en texto plano (será hasheada)
   * @param rol Rol del usuario (ADMIN o USER)
   * @param fechaNacimiento Fecha de nacimiento para cálculo de beneficios
   */
  private async createUser(
    name: string,
    email: string,
    passPlain: string,
    rol: Role,
    fechaNacimiento: Date,
  ) {
    // Generación de Salt y Hash (cost factor: 10)
    const passwordHash = await bcrypt.hash(passPlain, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: passwordHash,
      rol,
      fechaNacimiento,
    });

    await this.userRepository.save(newUser);
    this.logger.log(`Usuario creado exitosamente: ${email} [${rol}]`);
  }
}
