import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard'; // Importamos el nuevo Guard
import { ApiTags } from '@nestjs/swagger';

/**
 * Controlador para los endpoints /auth/*
 */
@ApiTags('auth') // Agrupa los endpoints bajo "auth" en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de Registro
   * POST /api/v1/auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Devuelve un estado 201 (Created)
  register(@Body() registerDto: RegisterDto) {
    // @Body() usa class-validator para validar el DTO automáticamente
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint de Login
   * POST /api/v1/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Devuelve un estado 200 (OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint de Perfil
   * GET /api/v1/auth/profile
   * Ruta protegida: solo accesible con un JWT válido.
   */
  @Get('profile')
  @UseGuards(AuthGuard) // Aplicamos nuestro nuevo Guard
  getProfile(@Request() req) {
    // 'req.user' es adjuntado por el AuthGuard
    // y contiene el payload del token (id, email, name, rol).
    return req.user;
  }
}
