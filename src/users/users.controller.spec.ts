import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = { id: 'uuid-123', name: 'Test', email: 'test@test.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOneById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar lista de usuarios', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un usuario por ID', async () => {
      const result = await controller.findOne('uuid-123');
      expect(service.findOneById).toHaveBeenCalledWith('uuid-123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario', async () => {
      const dto = { name: 'Updated' };
      const result = await controller.update('uuid-123', dto);
      expect(service.update).toHaveBeenCalledWith('uuid-123', dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('debe eliminar un usuario', async () => {
      await controller.remove('uuid-123');
      expect(service.remove).toHaveBeenCalledWith('uuid-123');
    });
  });
});
