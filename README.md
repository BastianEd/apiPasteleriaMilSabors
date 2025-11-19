# API Pastelería Mil Sabores 🍰

Backend desarrollado en **NestJS** para la gestión de la Pastelería Mil Sabores. Provee servicios RESTful para autenticación, gestión de usuarios y persistencia de datos.

## 🛠️ Tecnologías

-   **Framework:** NestJS (Node.js)
-   **Lenguaje:** TypeScript
-   **Base de Datos:** MySQL (vía Laragon o Docker)
-   **ORM:** TypeORM
-   **Autenticación:** JWT (JSON Web Tokens) + Passport
-   **Documentación:** Swagger (OpenAPI)

## 📋 Prerrequisitos

-   Node.js (v18 o superior recomendado)
-   MySQL (Corriendo en puerto 3306)
-   npm o yarn

## 🚀 Instalación y Configuración

1.  **Clonar el repositorio e instalar dependencias:**

    ```bash
    npm install
    ```

   2.  **Configurar Variables de Entorno:**
       Crea un archivo `.env` en la raíz del proyecto (puedes copiar este bloque):

       ```env
       # --- Configuración de la Base de Datos ---
       # Ajusta esto según tu configuración de Laragon/MySQL
       DB_TYPE=mysql
       DB_HOST=localhost
       DB_PORT=3306
       DB_USERNAME=root
       DB_PASSWORD=            # Pon tu clave si tienes una, si no, déjalo vacío
       DB_DATABASE=pasteleria_db # Tendrás que crear esta base de datos en Laragon
    
       # --- Configuración de JWT (Json Web Token) ---
           # Clave Super Secreta para JWT
       JWT_SECRET=chupaelperro1234$
       # Tiempo de expiración del token
       JWT_EXPIRES_IN= 1d
       ```

3.  **Levantar el entorno de desarrollo:**

    ```bash
    # Esto iniciará el servidor y creará las tablas automáticamente (synchronize: true)
    npm run start:dev
    ```

## 📚 Documentación de la API (Swagger)

Una vez iniciada la aplicación, visita la siguiente URL para ver y probar los endpoints:

👉 **http://localhost:3000/api-docs**

### 🔐 Cómo probar Endpoints Protegidos (Usuarios)

Los endpoints de gestión de usuarios (`GET`, `PATCH`, `DELETE`) están protegidos por un **AuthGuard**. Para usarlos:

1.  Ve a la sección **Auth** > `/auth/register` y crea un usuario.
2.  Ve a `/auth/login`, ingresa tus credenciales y ejecuta.
3.  Copia el `access_token` de la respuesta.
4.  Haz clic en el botón **Authorize** (candado) en la parte superior de Swagger.
5.  Pega el token y autoriza.
6.  Ahora podrás ejecutar los endpoints de **Users** sin recibir error 401.

## 🧪 Tests

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📂 Estructura del Proyecto
- src/app.*: Módulo raíz.
- src/auth/*: Lógica de Login, Registro y Guards (JWT).
- src/users/*: CRUD de Usuarios y Entidad de Base de Datos.
- src/main.ts: Punto de entrada, configuración de CORS, Pipes y Swagger.

## 👤 Autor
- Desarrollado por Bastián Rubio para Pastelería Mil Sabores.