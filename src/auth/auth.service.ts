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
  async register({ password, email, name }: RegisterDto) {
    // 1. Verificar si el email ya existe
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('El email ya existe');
    }

    // 2. Hashear la contraseña (NUNCA guardarla en texto plano)
    // Esto lo hacías en la entidad, ahora lo hacemos aquí.
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3. Crear el usuario en la base de datos
    // Pasamos los datos al servicio de usuarios, ya con la pass hasheada.
    await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      fechaNacimiento: new Date(),
    });

    // 4. Devolvemos una respuesta simple.
    // Podríamos también loguearlo y devolver un token aquí si quisiéramos.
    return {
      message: 'Usuario creado exitosamente',
    };
  }

  /**
   * Maneja el login y la generación del token.
   * Nivel de documentación: Senior
   * Se ajusta el retorno para incluir el ID del usuario explícitamente,
   * facilitando la persistencia del estado en el cliente (Frontend).
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

    // 3. Generar Payload
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      fechaNacimiento: user.fechaNacimiento,
      rol: user.rol,
    };

    const token = await this.jwtService.signAsync(payload);

    // 4. Devolver respuesta al Frontend
    // AGREGAMOS 'id: user.id' AQUÍ ABAJO 👇
    return {
      access_token: token,
      user: {
        id: user.id, // <--- ¡NUEVO! Vital para el frontend
        email: user.email,
        name: user.name,
        fechaNacimiento: user.fechaNacimiento,
        rol: user.rol,
      },
    };
  }
}
