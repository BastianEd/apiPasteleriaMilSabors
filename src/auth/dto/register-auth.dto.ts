import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para el Registro.
 *
 * Define la estructura de datos que esperamos recibir en el 'body'
 * de la petición HTTP POST para registrar un nuevo usuario.
 * Las anotaciones (@IsString, @IsEmail, etc.) son usadas por
 * 'class-validator' (que activamos en main.ts) para validar los datos.
 */
export class RegisterAuthDto {
  /**
   * @ApiProperty le dice a Swagger qué mostrar en la documentación.
   */
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Bastián Bravo',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({
    description: 'Email único del usuario',
    example: 'bastian.bravo@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: '123456',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '1995-05-20',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD',
  })
  fechaNacimiento: string;
}
