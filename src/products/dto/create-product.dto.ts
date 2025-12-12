import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'TC001', description: 'Código único del producto' })
  @IsString()
  @MinLength(3)
  codigo: string;

  @ApiProperty({
    example: 'Torta de Chocolate',
    description: 'Nombre comercial',
  })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({ example: 'Tortas', description: 'Categoría del producto' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 45000, description: 'Precio en CLP' })
  @IsInt()
  @Min(0)
  precio: number;

  @ApiProperty({
    example: 'Deliciosa torta...',
    description: 'Descripción detallada',
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    example: 'torta-chocolate.webp',
    description: 'Nombre del archivo de imagen',
  })
  @IsString()
  imagen: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  destacado?: boolean;
}
