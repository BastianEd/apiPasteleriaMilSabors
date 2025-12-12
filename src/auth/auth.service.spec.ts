import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

// Mockeamos bcryptjs para evitar el costo computacional del hash en tests
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token_jwt_mock'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('debe registrar un usuario exitosamente', async () => {
      const registerDto = {
        name: 'Test',
        email: 'new@test.com',
        password: '123',
        fechaNacimiento: new Date(),
        rol: 'user',
      };

      // Mock: El usuario no existe
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);
      // Mock: Hash devuelve una cadena
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await service.register(registerDto as any);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed_password', // Verificamos que se guarde hasheada
        }),
      );
      expect(result).toEqual({ message: 'Usuario creado exitosamente' });
    });

    it('debe fallar si el email ya existe', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(
        service.register({ email: 'exist@test.com' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('debe retornar token y usuario si las credenciales son válidas', async () => {
      const loginDto = { email: 'test@test.com', password: '123' };
      const user = {
        id: 'uuid',
        email: 'test@test.com',
        password: 'hashed_password',
        rol: 'user',
      };

      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true); // Password coincide

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', 'token_jwt_mock');
      expect(result).toHaveProperty('user');
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const user = {
        id: 'uuid',
        email: 'test@test.com',
        password: 'hashed_password',
      };
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false); // Password NO coincide

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
