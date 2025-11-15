import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

/**
 * JwtStrategy (Estrategia JWT)
 *
 * Esta estrategia se usa para *proteger* todas las rutas que requieran
 * que el usuario esté autenticado.
 * Se encarga de extraer el Token JWT de la cabecera 'Authorization'
 * de la petición, verificar que sea válido y encontrar al usuario en la BD.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // 1. Dónde buscar el token: de la cabecera 'Authorization' como 'Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. No ignorar si el token expiró (¡importante!)
      ignoreExpiration: false,

      // 3. El mismo secreto que usamos para firmar el token (.env)
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Este método 'validate' es llamado automáticamente por Passport
   * después de verificar la firma del token (y que no haya expirado).
   * El 'payload' es el objeto que guardamos dentro del token cuando hicimos login.
   *
   * @param payload - El contenido decodificado del JWT (ej: { sub: 'uuid', email: '...' })
   */
  async validate(payload: { sub: number; email: string }) {
    // Buscamos al usuario en la BD usando el ID (sub) del token.
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    // Lo que retornemos aquí será adjuntado por Passport al
    // objeto 'request' (request.user) en CADA petición protegida.
    // Omitimos la contraseña por seguridad.
    const { password, ...result } = user;
    return result;
  }
}
