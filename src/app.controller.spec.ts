import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Welcome to the Expansion Management API!'),
            getHealth: jest.fn().mockReturnValue({
              status: 'ok',
              timestamp: new Date().toISOString(),
              service: 'expansion-management-api',
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Welcome to the Expansion Management API!"', () => {
      expect(appController.getHello()).toBe('Welcome to the Expansion Management API!');
    });
  });
});