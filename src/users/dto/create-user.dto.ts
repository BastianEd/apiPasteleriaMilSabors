import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
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

  @IsOptional()
  @IsEnum(Role)
  rol?: Role;
}
