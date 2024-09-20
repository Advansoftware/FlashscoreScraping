import { Test, TestingModule } from '@nestjs/testing';
import { FlashscoreController } from './flashscore.controller';

describe('FlashscoreController', () => {
  let controller: FlashscoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashscoreController],
    }).compile();

    controller = module.get<FlashscoreController>(FlashscoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
