import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Mock del QueryBuilder para findOneByEmail
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockUsersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockUser = {
    id: 'uuid-123',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashedpassword',
    fechaNacimiento: new Date(),
    rol: 'user',
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear y guardar un usuario', async () => {
      const createUserDto = {
        name: 'New User',
        email: 'new@test.com',
        password: '123',
        fechaNacimiento: new Date(),
        rol: 'user',
      };

      (repository.create as jest.Mock).mockReturnValue(mockUser);
      (repository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(createUserDto as any);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('debe retornar un array de usuarios', async () => {
      (repository.find as jest.Mock).mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOneByEmail', () => {
    it('debe encontrar un usuario por email', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@test.com');

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        {
          email: 'test@test.com',
        },
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneById', () => {
    it('debe retornar un usuario si existe', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOneById('uuid-123');
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneById('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario exitosamente', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      // preload devuelve el objeto fusionado si encuentra el ID
      (repository.preload as jest.Mock).mockResolvedValue(updatedUser);
      (repository.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update('uuid-123', updateUserDto);

      expect(repository.preload).toHaveBeenCalledWith({
        id: 'uuid-123',
        ...updateUserDto,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('debe lanzar NotFoundException si el usuario a actualizar no existe', async () => {
      // preload devuelve undefined si no encuentra la entidad
      (repository.preload as jest.Mock).mockResolvedValue(undefined);

      await expect(service.update('bad-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar (soft remove) un usuario', async () => {
      // Reutilizamos findOneById, así que mockeamos findOneBy
      (repository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (repository.softRemove as jest.Mock).mockResolvedValue(undefined);

      await service.remove('uuid-123');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-123' });
      expect(repository.softRemove).toHaveBeenCalledWith(mockUser);
    });

    it('debe lanzar NotFoundException si el usuario a eliminar no existe', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
      // softRemove NO debería llamarse
      expect(repository.softRemove).not.toHaveBeenCalled();
    });
  });
});
