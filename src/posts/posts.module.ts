import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importante
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity'; // <--- Importar la Entidad

@Module({
  imports: [TypeOrmModule.forFeature([Post])], // <--- Registrar la Entidad aquí
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
