import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de artículos de blog.
 * Modificado para aceptar Emojis en el campo imagen.
 */
export class CreatePostDto {
  @ApiProperty({ example: '5 Tips para hornear mejor' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'El secreto está en la temperatura...' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ example: 'Juan Pastelero' })
  @IsString()
  @IsOptional()
  autor?: string;

  @ApiProperty({ example: 'Tips' })
  @IsString()
  @IsOptional()
  categoria?: string;

  // CORRECCIÓN: Eliminado @IsUrl() para permitir Emojis (e.g. "🎂") o URLs
  @ApiProperty({
    example: '🎂',
    description: 'Puede ser una URL de imagen o un Emoji',
  })
  @IsString()
  @IsOptional()
  imagen?: string;
}
