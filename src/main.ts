import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * El "bootstrap" es la función que inicializa y arranca nuestra aplicación NestJS.
 */
async function bootstrap() {
  // 1. Creamos la instancia de la aplicación Nest, basada en nuestro módulo raíz (AppModule)
  const app = await NestFactory.create(AppModule);

  // 2. Habilitamos CORS (Cross-Origin Resource Sharing)
  // Esto es VITAL para permitir que tu frontend (React) se comunique
  // con este backend, ya que estarán en dominios/puertos diferentes.
  app.enableCors();

  // 3. Establecemos un prefijo global para todas las rutas
  // Ahora, todas las rutas de la API empezarán con /api/v1
  // Ejemplo: /api/v1/products, /api/v1/auth
  app.setGlobalPrefix('api/v1');

  // 4. Configuramos el ValidationPipe globalmente
  // Esto hace que NestJS use automáticamente 'class-validator' en todos los DTOs
  // que lleguen a los controladores.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve cualquier propiedad que no esté definida en el DTO.
      forbidNonWhitelisted: true, // Lanza un error si se reciben propiedades no definidas.
      transform: true, // Transforma automáticamente los datos de entrada al tipo del DTO (ej. string a number).
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. Configuramos Swagger (OpenAPI) para la documentación
  const config = new DocumentBuilder()
    .setTitle('API Pastelería Mil Sabores')
    .setDescription(
      'Documentación de la API RESTful para la Pastelería Mil Sabores.',
    )
    .setVersion('1.0')
    .addBearerAuth() // <-- Esto es clave para indicar que usamos JWT (Bearer Token)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // La documentación estará disponible en la ruta /api-docs
  SwaggerModule.setup('api-docs', app, document, {
    useGlobalPrefix: false, // pon true si quieres /api/v1/api-docs
  });

  await app.listen(3000);
  // 7. Iniciamos la aplicación
  Logger.log('📄 Documentación (Swagger): http://localhost:3000/api-docs');
}
bootstrap();
