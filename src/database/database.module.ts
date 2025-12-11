import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    // Importamos TypeOrmModule.forFeature para poder inyectar el repositorio de User en el SeedService
    TypeOrmModule.forFeature([User]),
  ],
  providers: [SeedService],
  exports: [SeedService], // Exportamos por si otros módulos lo necesitan en el futuro
})
export class DatabaseModule {}
