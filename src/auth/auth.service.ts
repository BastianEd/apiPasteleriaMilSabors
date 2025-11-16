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
   */
  async login({ email, password }: LoginDto) {
    // 1. Buscar al usuario por email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Usamos UnauthorizedException para credenciales incorrectas (Error 401)
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // 2. Comparar la contraseña enviada (plana) con el hash guardado (hasheada)
    // Esto lo hacías en el método user.validatePassword(), ahora lo hacemos aquí.
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // 3. Generar el Payload del JWT (datos que queremos en el token)
    // No incluyas información sensible aquí (como la contraseña)
    const payload = {
      sub: user.id, // 'sub' (subject) es el estándar para el ID de usuario
      email: user.email,
      name: user.name,
      fechaNacimiento: user.fechaNacimiento,
      rol: user.rol, // Incluimos el rol, muy útil en el frontend
    };

    // 4. Firmar el token
    const token = await this.jwtService.signAsync(payload);

    // 5. Devolver el token e información útil al frontend
    return {
      access_token: token,
      user: {
        email: user.email,
        name: user.name,
        fechaNacimiento: user.fechaNacimiento,
        rol: user.rol,
      },
    };
  }
}
