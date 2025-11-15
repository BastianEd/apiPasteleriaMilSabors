import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

/**
 * AuthService
 *
 * Contiene la lógica de negocio principal para el registro,
 * validación (login) y creación de tokens.
 */
@Injectable()
export class AuthService {
  /**
   * Inyectamos los servicios que necesitamos:
   * - UsersService: Para interactuar con la BD de usuarios.
   * - JwtService: Para crear los JSON Web Tokens.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Lógica de Registro de Usuario.
   * @param registerDto - Datos del nuevo usuario.
   */
  async register(registerDto: RegisterAuthDto) {
    // 1. Verificamos si el email ya existe
    const userExists = await this.usersService.findOneByEmail(registerDto.email);
    if (userExists) {
      // Si existe, lanzamos un error de "Conflicto" (409)
      throw new ConflictException('El email ya está registrado');
    }

    try {
      // 2. Si no existe, creamos el nuevo usuario
      const user = await this.usersService.create(registerDto);

      // 3. Una vez creado, generamos su token (lo logueamos)
      return this.generateJwt(user.id, user.email, user.role);
    } catch (error) {
      // Manejamos cualquier error inesperado de la BD
      throw new InternalServerErrorException(
        'Error al crear el usuario',
        error.message,
      );
    }
  }

  /**
   * Lógica de Validación de Usuario (para Login).
   * Este método es usado por la 'LocalStrategy'.
   * @param email - Email del usuario.
   * @param pass - Contraseña en texto plano.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // 1. Buscamos al usuario por email (pidiendo la contraseña)
    const user = await this.usersService.findOneByEmail(email);

    // 2. Si no encontramos usuario O la contraseña no coincide...
    // (Usamos el método 'validatePassword' que creamos en la entidad User)
    if (!user || !(await user.validatePassword(pass))) {
      return null; // Devolvemos null y la LocalStrategy lanzará UnauthorizedException
    }

    // 3. Si todo es correcto, devolvemos el usuario (sin el password)
    const { password, ...result } = user;
    return result;
  }

  /**
   * Lógica de Login (Generación de Token).
   * Este método es llamado por el AuthController *después* de que
   * la LocalStrategy (validateUser) ha sido exitosa.
   * @param user - El objeto usuario validado (devuelto por LocalStrategy).
   */
  async login(user: any) {
    // El usuario ya fue validado, solo necesitamos generar el token.
    return this.generateJwt(user.id, user.email, user.role);
  }

  /**
   * Función helper privada para generar el JWT.
   */
  private generateJwt(userId: number, email: string, role: string) {
    // El "payload" es la información que guardaremos dentro del token.
    // NUNCA guardes contraseñas aquí.
    const payload = {
      sub: userId, // 'sub' (subject) es el estándar para el ID de usuario
      email: email,
      role: role,
    };

    // Firmamos el token usando el secreto y la expiración del .env
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: payload,
    };
  }
}
