import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'; // Usamos bcryptjs
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    // Inyectamos el servicio de usuarios para buscar/crear usuarios
    private readonly usersService: UsersService,
    // Inyectamos el servicio JWT para firmar tokens
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Maneja el registro de un nuevo usuario.
   */
  async register({ password, email, name, fechaNacimiento }: RegisterDto) {
    // 1. Verificar si el email ya existe
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('El email ya existe');
    }

    // 2. Hashear la contraseña (NUNCA guardarla en texto plano)
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3. Crear el usuario en la base de datos
    // CORRECCIÓN: Pasamos 'fechaNacimiento' que viene del DTO, no 'new Date()'
    await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      fechaNacimiento: fechaNacimiento,
    });

    // 4. Devolvemos una respuesta simple.
    return {
      message: 'Usuario creado exitosamente',
    };
  }

  /**
   * Maneja el login y la generación del token.
   * Se incluye el ID y ROL en el retorno para gestión de estado en Frontend.
   */
  async login({ email, password }: LoginDto) {
    // 1. Buscar al usuario por email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // 2. Validar contraseña
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // 3. Generar Payload para el JWT
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      fechaNacimiento: user.fechaNacimiento,
      rol: user.rol,
    };

    const token = await this.jwtService.signAsync(payload);

    // 4. Devolver respuesta al Frontend
    // Importante: Devolver 'user' completo permite al frontend calcular beneficios inmediatamente
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        fechaNacimiento: user.fechaNacimiento,
        rol: user.rol,
      },
    };
  }
}
