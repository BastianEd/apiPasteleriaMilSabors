import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * 1. Definimos la forma de nuestro Payload de JWT.
 * Esto debe coincidir con lo que pones en `auth.service.ts`
 * al firmar el token (sub, email, name, rol).
 */
interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  rol: string;
}

/**
 * 2. Extendemos la Request de Express para añadir
 * la propiedad `user`, que ahora será de tipo `JwtPayload`.
 * Esto nos da autocompletado en los controladores.
 */
interface AuthRequest extends Request {
  user: JwtPayload;
}

/**
 * AuthGuard
 * Un Guard es un middleware que decide si una petición debe
 * ser manejada por el controlador o no (ej. si tiene permisos).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * canActivate es el método principal del Guard.
   * Debe devolver 'true' para permitir el acceso, o lanzar un error.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Obtenemos el objeto 'request' de la petición HTTP.
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // 2. Extraemos el token del header 'Authorization'.
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'No se proporcionó token de autorización',
      );
    }

    try {
      // 3. Verificamos el token (que sea válido y no haya expirado)
      // Usamos nuestro tipo JwtPayload para que TypeScript sepa qué forma tiene.
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // 4. Si es válido, adjuntamos el payload a la request.
      // Ahora, en nuestro controlador (ej. getProfile), podemos acceder a 'req.user'.
      request.user = payload;
    } catch {
      // 5. Si 'verifyAsync' falla (token expirado, firma inválida),
      // lanzamos un error 401.
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // 6. Si todo salió bien, permitimos el acceso.
    return true;
  }

  // Método privado para extraer el token "Bearer <token>"
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
