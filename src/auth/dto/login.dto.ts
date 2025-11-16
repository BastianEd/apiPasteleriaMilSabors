import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para el Login.
 * Define los datos que esperamos en el body de la petición /auth/login.
 */
export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  // @Transform es útil para limpiar datos (ej. quitar espacios en blanco)
  // antes de que lleguen a la lógica de validación o al servicio.
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  password: string;


}
