import {
  IsEmail,
  IsString,
  MinLength,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

/**
 * DTO para el Registro.
 * Define los datos que esperamos en el body de la petición /auth/register.
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Perez',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@correo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'supersecret',
  })
  @IsString()
  @MinLength(6)
  @Transform(({ value }: { value: unknown }): string =>
    typeof value === 'string' ? value.trim() : '',
  )
  password: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '1995-08-15',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  fechaNacimiento: Date;

  @ApiProperty({ example: 'admin', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  rol?: Role;
}
