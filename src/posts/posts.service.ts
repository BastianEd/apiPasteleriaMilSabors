import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    // Inyectamos el Repositorio de la entidad Post
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * Crea un nuevo artículo de blog en la base de datos.
   */
  async create(createPostDto: CreatePostDto) {
    // 1. Preparamos la entidad con los datos del DTO
    const post = this.postRepository.create(createPostDto);
    // 2. Guardamos en BD
    return await this.postRepository.save(post);
  }

  /**
   * Obtiene todos los artículos, ordenados por fecha (más recientes primero).
   */
  async findAll() {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca un artículo por su ID.
   */
  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`El artículo con ID #${id} no existe`);
    }
    return post;
  }

  /**
   * Actualiza un artículo existente.
   */
  async update(id: number, updatePostDto: UpdatePostDto) {
    // preload busca por ID y reemplaza los campos que vengan en el DTO
    const post = await this.postRepository.preload({
      id: id,
      ...updatePostDto,
    });

    if (!post) {
      throw new NotFoundException(`El artículo con ID #${id} no existe`);
    }

    return await this.postRepository.save(post);
  }

  /**
   * Elimina un artículo de la base de datos.
   */
  async remove(id: number) {
    const post = await this.findOne(id); // Reutilizamos findOne para validar que exista
    await this.postRepository.remove(post);
    return { message: `Artículo #${id} eliminado correctamente` };
  }
}
