import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ message: 'ok' }),
            login: jest.fn().mockResolvedValue({ access_token: 'token' }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('debe registrar un usuario', async () => {
    const dto = { email: 'a@a.com', password: '123' } as any;
    await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('debe loguear un usuario', async () => {
    const dto = { email: 'a@a.com', password: '123' };
    await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('debe retornar el perfil del request', () => {
    const req = { user: { id: 1, email: 'test' } };
    const result = controller.getProfile(req);
    expect(result).toEqual(req.user);
  });
});
