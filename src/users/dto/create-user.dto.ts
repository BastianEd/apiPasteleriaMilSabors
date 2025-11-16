import { IsEmail, IsNotEmpty, IsString, MinLength, IsDate } from 'class-validator';

/**
 * DTO (Objeto de Transferencia de Datos) para crear un Usuario.
 * Define la forma de los datos que el UsersService espera.
 * Los decoradores (@IsEmail, @MinLength, etc.) son usados por class-validator
 * para asegurar que los datos sean correctos.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Asegúrate de que coincida con la validación de RegisterDto
  password: string;

  @IsDate()
  fechaNacimiento: Date;

  // El 'rol' se asigna con un valor por defecto en la entidad,
  // por lo que no es necesario pedirlo aquí.
}
