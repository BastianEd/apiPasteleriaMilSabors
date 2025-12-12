import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { NotFoundException } from '@nestjs/common';

const mockPostRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

describe('PostsService', () => {
  let service: PostsService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useFactory: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get(getRepositoryToken(Post));
  });

  describe('update', () => {
    it('debe actualizar un post existente', async () => {
      const updateDto = { title: 'Updated' };
      const post = { id: 1, title: 'Old' };
      const updatedPost = { id: 1, title: 'Updated' };

      repository.preload.mockResolvedValue(updatedPost);
      repository.save.mockResolvedValue(updatedPost);

      const result = await service.update(1, updateDto as any);
      expect(result).toEqual(updatedPost);
      expect(repository.preload).toHaveBeenCalledWith({ id: 1, ...updateDto });
    });

    it('debe lanzar error si el post no existe para actualizar', async () => {
      repository.preload.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un post', async () => {
      const post = { id: 1 };
      repository.findOneBy.mockResolvedValue(post);
      repository.remove.mockResolvedValue(post);

      await service.remove(1);
      expect(repository.remove).toHaveBeenCalledWith(post);
    });
  });
});
