import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * LocalStrategy (Estrategia Local)
 *
 * Esta estrategia se usa *específicamente* para el endpoint de Login (/auth/login).
 * Se encarga de recibir el 'email' y 'password' del body de la petición,
 * y validarlos contra la base de datos.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      // Le decimos a Passport que el campo 'username'
      // en realidad se llamará 'email' en nuestro DTO.
      usernameField: 'email',
    });
  }

  /**
   * Este método 'validate' es llamado automáticamente por Passport
   * cuando usamos el 'AuthGuard('local')' en la ruta de login.
   *
   * @param email - El email extraído del body.
   * @param password - El password extraído del body.
   */
  async validate(email: string, password: string): Promise<any> {
    // Llamamos a nuestro servicio de autenticación para validar.
    const user = await this.authService.validateUser(email, password);

    // Si el servicio devuelve null, significa que las credenciales son inválidas.
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Si todo está bien, Passport adjuntará el 'user'
    // al objeto 'request' (request.user),
    // que luego usamos en el controlador de login.
    return user;
  }
}
