import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO para actualizar un Usuario.
 * PartialType toma todas las reglas de validación de CreateUserDto
 * y las marca como opcionales.
 * Esto es ideal para operaciones PATCH, donde solo quieres actualizar
 * algunos campos (ej. solo el nombre, o solo la contraseña).
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
