import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

/**
 * El AppModule es el módulo raíz de la aplicación.
 * Es responsable de "ensamblar" todas las piezas (otros módulos).
 */
@Module({
  imports: [
    // 1. ConfigModule: Para cargar y gestionar las variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }),

    // 2. TypeOrmModule: Para la conexión con la base de datos (MySQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importamos ConfigModule para usar ConfigService
      inject: [ConfigService], // Inyectamos el servicio para leer las variables
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        // 'entities' le dice a TypeORM qué clases son modelos de tablas.
        // Usamos autoLoadEntities para que las cargue automáticamente
        // a medida que las vayamos añadiendo en los módulos.
        autoLoadEntities: true,

        // 'synchronize: true' crea/actualiza automáticamente las tablas
        // en la BD basándose en las entidades.
        // ¡ADVERTENCIA: Úsalo solo en desarrollo! En producción se usan "migraciones".
        synchronize: true,
      }),
    }),

    AuthModule,

    UsersModule,
  ],
  controllers: [AppController], // El controlador por defecto (podemos borrarlo después)
  providers: [AppService], // El servicio por defecto (podemos borrarlo después)
})
export class AppModule {}
