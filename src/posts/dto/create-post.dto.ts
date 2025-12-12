import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'https://via.placeholder.com/300' })
  @IsUrl()
  @IsOptional()
  imagen?: string;
}
