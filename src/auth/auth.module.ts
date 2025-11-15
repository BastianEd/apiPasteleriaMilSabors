import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * AuthModule
 *
 * Este módulo se encarga de todo lo relacionado con la autenticación:
 * Login, Registro y la generación/validación de JSON Web Tokens (JWT).
 */
@Module({
  imports: [
    // 1. Importamos UsersModule para tener acceso a UsersService,
    // que usaremos para buscar y crear usuarios en la BD.
    UsersModule,

    // 2. Configuramos Passport, la librería principal para manejar
    // las "estrategias" de autenticación.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 3. Configuramos JwtModule de forma asíncrona (registerAsync)
    // Esto nos permite leer las variables de entorno (.env)
    // que cargamos en AppModule.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>('JWT_SECRET');

        // Tipado correcto: number | StringValue (e.g. 3600, "15m", "1h")
        const expiresIn =
          configService.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES_IN');

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  // Los Controladores y Servicios que generamos con el CLI
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService], // Añadiremos las Estrategias aquí en el siguiente paso
})
export class AuthModule {}
