import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    // Configuramos el módulo de testing simulando la inyección de dependencias
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          // Mockeamos el servicio para no depender de su lógica interna
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('debe estar definido', () => {
    expect(appController).toBeDefined();
  });

  describe('root', () => {
    it('debe retornar "Hello World!"', () => {
      // Act
      const result = appController.getHello();

      // Assert
      expect(result).toBe('Hello World!');
      expect(appService.getHello).toHaveBeenCalled();
    });
  });
});
