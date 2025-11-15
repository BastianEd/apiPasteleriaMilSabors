import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) para el Login.
 *
 * Define la estructura de datos que esperamos para el inicio de sesión.
 */
export class LoginAuthDto {
  @ApiProperty({
    description: 'Email registrado',
    example: 'bastian.bravo@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña registrada',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
