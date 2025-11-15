import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

/**
 * UsersService
 *
 * Este servicio encapsula toda la lógica de negocio relacionada
 * con la entidad 'User'. Es el único lugar que debe interactuar
 * directamente con el repositorio de usuarios.
 */
@Injectable()
export class UsersService {
  /**
   * Inyectamos el Repositorio de 'User'.
   * 'InjectRepository' es la forma en que TypeORM nos da acceso
   * a los métodos de la base de datos (find, create, save, etc.)
   * para la entidad 'User'.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Este método es usado por el 'AuthService' durante el registro.
   * @param registerAuthDto - Los datos validados para crear el usuario.
   */
  async create(registerAuthDto: RegisterAuthDto): Promise<User> {
    // Creamos una instancia de la entidad User con los datos del DTO
    const user = this.userRepository.create(registerAuthDto);

    // Guardamos el usuario.
    // NOTA: El hasheo de la contraseña ocurre automáticamente
    // gracias al hook @BeforeInsert que definimos en la entidad User.
    return this.userRepository.save(user);
  }

  /**
   * Busca un usuario por su email.
   * Este método es crucial para el login, para verificar si el usuario existe.
   * @param email - El email del usuario a buscar.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    // Usamos 'createQueryBuilder' para poder pedir explícitamente
    // la columna 'password', que marcamos con 'select: false' en la entidad.
    return this.userRepository
      .createQueryBuilder('user') // 'user' es un alias para la tabla User
      .where('user.email = :email', { email }) // :email es un parámetro
      .addSelect('user.password') // ¡Importante! Pedimos la contraseña
      .getOne(); // Obtenemos un solo resultado (o null)
  }

  /**
   * Busca un usuario por su ID.
   * Este método será usado por la estrategia de JWT para
   * validar el token en cada petición protegida.
   * @param id - El UUID del usuario a buscar.
   */
  async findOneById(id: number): Promise<User | null> {
    // findOneBy es un atajo simple para buscar por una columna
    return this.userRepository.findOneBy({ id });
  }

  // Aquí irían otros métodos del CRUD si los necesitáramos (findAll, update, remove)
  // que serían usados por el UsersController.
}
