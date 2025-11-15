import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard
 *
 * Este Guard simplemente invoca la 'LocalStrategy' que creamos.
 * Lo usamos en el endpoint de /login.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
