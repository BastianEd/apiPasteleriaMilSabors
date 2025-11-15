import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard
 *
 * Este Guard se usará para proteger las rutas que requieran un JWT válido.
 * Simplemente extiende el 'AuthGuard' de Passport, especificando la
 * estrategia 'jwt' que creamos en 'jwt.strategy.ts'.
 *
 * Cuando lo pongamos en un controlador (@UseGuards(JwtAuthGuard)),
 * automáticamente hará lo siguiente:
 * 1. Extraer el token de la cabecera 'Authorization'.
 * 2. Validar el token (firma y expiración).
 * 3. Llamar al método 'validate()' de nuestra 'JwtStrategy'.
 * 4. Si todo es correcto, adjuntará el usuario (de 'validate()') a 'request.user'.
 * 5. Si algo falla (no hay token, token inválido), lanzará un error 401 Unauthorized.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // (Opcional) Podemos sobreescribir métodos aquí para personalizar el manejo
  // de errores, pero para empezar, con esto es suficiente.
}
