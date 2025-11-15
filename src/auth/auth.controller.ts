import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard'; // (Ver Paso 14.1)
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * AuthController
 *
 * Define los endpoints (rutas) públicos para la autenticación.
 * @ApiTags('Auth') agrupa estos endpoints en la documentación de Swagger.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de Registro de Usuario
   * Ruta: POST /api/v1/auth/register
   */
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto) {
    // El @Body() le dice a Nest que tome el cuerpo de la petición
    // y lo valide usando nuestro DTO 'RegisterAuthDto'.
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint de Login de Usuario
   * Ruta: POST /api/v1/auth/login
   *
   * @UseGuards(LocalAuthGuard) es la clave aquí. Le dice a Nest:
   * "Antes de ejecutar este método 'login', usa el Guard 'local'".
   * El 'LocalAuthGuard' (que usa nuestra LocalStrategy) se encargará de
   * validar el email y password. Si son correctos, adjuntará
   * el usuario a 'req.user'. Si no, lanzará un error 401.
   */
  @ApiOperation({ summary: 'Iniciar sesión (Obtener Token JWT)' })
  @ApiBody({ type: LoginAuthDto }) // Le dice a Swagger qué cuerpo esperar
  @UseGuards(LocalAuthGuard) // (Ver Paso 14.1)
  @Post('login')
  async login(@Request() req) {
    // Si llegamos aquí, es porque 'LocalAuthGuard' fue exitoso.
    // 'req.user' contiene el usuario validado por LocalStrategy.
    // Solo necesitamos pasarle ese usuario al servicio para generar el token.
    return this.authService.login(req.user);
  }

  /**
   * Endpoint de Perfil (Ruta Protegida de Ejemplo)
   * Ruta: GET /api/v1/auth/profile
   *
   * @UseGuards(JwtAuthGuard) protege esta ruta.
   * Solo se puede acceder si se envía un 'Bearer Token' válido
   * en la cabecera 'Authorization'.
   */
  @ApiOperation({
    summary: 'Obtener perfil del usuario actual (Ruta protegida)',
  })
  @ApiBearerAuth() // Le dice a Swagger que esta ruta necesita el token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Gracias al 'JwtAuthGuard', 'req.user' ahora contiene
    // el payload del token (id, email, role) que fue validado
    // por nuestra 'JwtStrategy'.
    return req.user;
  }
}
