import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtSignOptions} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Importamos UsersModule para poder usar UsersService en AuthService
    UsersModule,

    // PassportModule sigue siendo necesario como base para los Guards
    PassportModule,

    // Usamos registerAsync para cargar la configuración de forma asíncrona
    JwtModule.registerAsync({
      // Hacemos el módulo JWT global para no tener que importarlo
      // en otros módulos si quisiéramos usar JwtService
      global: true,
      imports: [ConfigModule], // Necesitamos ConfigModule para leer el .env
      inject: [ConfigService], // Inyectamos el ConfigService

      // Definimos el tipo de retorno de la función
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET no está definido en el archivo .env');
        }

        // --- 2. ESTA ES LA LÍNEA CORREGIDA ---
        // Le decimos a get() que el tipo que esperamos es el mismo que
        // 'expiresIn' espera en JwtSignOptions.
        // También mantenemos el valor por defecto '1d'.
        const expiresIn = configService.get<JwtSignOptions['expiresIn']>(
          'JWT_EXPIRES_IN',
          '1d',
        );

        return {
          secret: secret,
          signOptions: {
            expiresIn: expiresIn, // Ahora el tipo coincide perfectamente
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  // Declaramos AuthService como provider.
  // Ya NO necesitamos LocalStrategy ni JwtStrategy.
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
