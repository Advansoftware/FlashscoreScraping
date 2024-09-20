import { Test, TestingModule } from '@nestjs/testing';
import { FutebolController } from './futebol.controller';

describe('FlashscoreController', () => {
  let controller: FutebolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FutebolController],
    }).compile();

    controller = module.get<FutebolController>(FutebolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
