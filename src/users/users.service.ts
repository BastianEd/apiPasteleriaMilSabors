import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Importamos el DTO

/**
 * UsersService
 * Encargado de la lógica de negocio y la comunicación con
 * la base de datos para la entidad 'User'.
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Inyectamos el Repositorio de User.
     * @InjectRepository(User) le da a 'usersRepository'
     * todos los métodos para interactuar con la tabla 'users' (find, save, create, etc.).
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Usado por el AuthService durante el registro.
   * @param createUserDto Los datos del usuario a crear.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Creamos una instancia de la entidad con los datos del DTO.
    const user = this.usersRepository.create(createUserDto);

    // 2. Guardamos la entidad en la base de datos.
    // NOTA: El hashing de la contraseña se hará en AuthService *antes* de llamar a este método.
    return await this.usersRepository.save(user);
  }

  /**
   * Busca un usuario por su email.
   * Es vital para el login y para verificar si un email ya existe.
   * @param email El email a buscar.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    // findOneBy es un atajo de TypeORM para buscar un registro
    // que coincida con el criterio (en este caso, el email).
    return await this.usersRepository
      .createQueryBuilder('user') // 'user' es el alias de la tabla
      .where('user.email = :email', { email }) // Filtramos por email
      .addSelect('user.password') // ¡Pedimos la contraseña explícitamente!
      .getOne(); // Obtenemos un solo resultado
  }

  /**
   * Busca un usuario por su ID.
   * Útil para el endpoint de 'profile' y para la validación del AuthGuard.
   * @param id El ID numérico del usuario.
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    // Si no encontramos al usuario, lanzamos un error 404.
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Lista todos los usuarios.
   */
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  /**
   * Actualiza un usuario existente.
   * Primero verificamos que exista, luego actualizamos.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Preload busca una entidad por ID y reemplaza los campos con los del DTO
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return await this.usersRepository.save(user);
  }

  /**
   * Elimina un usuario (Borrado lógico recomendado por tu entidad que tiene deletedAt).
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id); // Reutilizamos tu método que ya valida si existe
    await this.usersRepository.softRemove(user); // softRemove llena el campo deletedAt
  }
}
