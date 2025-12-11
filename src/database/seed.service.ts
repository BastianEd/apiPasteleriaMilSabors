import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // Usamos la librería instalada
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

/**
 * SeedService
 * Se encarga de poblar la base de datos con datos iniciales si no existen.
 * Implementa OnModuleInit para ejecutarse al arrancar la aplicación.
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
   * Ciclo de vida de NestJS. Se ejecuta una vez que el módulo ha sido instanciado.
   */
  async onModuleInit() {
    await this.seedUsers();
  }

  /**
   * Lógica principal para crear usuarios de prueba y administrador.
   */
  private async seedUsers() {
    // 1. Verificar si ya existe el Administrador principal
    const adminEmail = 'admin@milsabores.com';
    const adminExist = await this.userRepository.findOneBy({
      email: adminEmail,
    });

    if (!adminExist) {
      this.logger.log('Sembrando Administrador del sistema...');
      await this.createUser(
        'Admin Principal',
        adminEmail,
        'Admin123!', // En producción, esto debería venir de variables de entorno (ConfigService)
        Role.ADMIN,
      );
    }

    // 2. Verificar usuarios de prueba
    // Contamos cuántos usuarios con rol USER existen
    const usersCount = await this.userRepository.count({
      where: { rol: Role.USER },
    });

    // Si hay menos de 3, creamos los faltantes para llegar a 3
    if (usersCount < 3) {
      this.logger.log(
        `Sembrando usuarios de prueba (actuales: ${usersCount})...`,
      );

      const usersToCreate = 3 - usersCount;
      for (let i = 1; i <= usersToCreate; i++) {
        // Usamos un timestamp para asegurar emails únicos en cada ejecución si fuera necesario
        const uniqueSuffix = Date.now() + i;
        await this.createUser(
          `Usuario Prueba ${i}`,
          `user${uniqueSuffix}@test.com`,
          'UserPass123!',
          Role.USER,
        );
      }
    }
  }

  /**
   * Helper para crear y guardar un usuario con contraseña hasheada.
   */
  private async createUser(
    name: string,
    email: string,
    passPlain: string,
    rol: Role,
  ) {
    // Hashing de contraseña (Salt rounds: 10)
    const passwordHash = await bcrypt.hash(passPlain, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: passwordHash,
      rol,
      fechaNacimiento: new Date('1990-01-01'), // Fecha dummy
    });

    await this.userRepository.save(newUser);
    this.logger.log(`Usuario creado: ${email} [${rol}]`);
  }
}
