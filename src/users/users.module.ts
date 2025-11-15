import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

/**
 * UsersModule
 *
 * Este módulo agrupa todo lo relacionado con la gestión de usuarios.
 */
@Module({
  imports: [
    // 1. Importamos TypeOrmModule.forFeature([User])
    // Esto registra la entidad 'User' en este módulo,
    // permitiéndonos inyectar '@InjectRepository(User)' en el 'UsersService'.
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // 2. Exportamos el 'UsersService'
  // Esto es VITAL para que otros módulos (como AuthModule)
  // puedan importar 'UsersModule' y usar 'UsersService'.
  exports: [UsersService],
})
export class UsersModule {}
