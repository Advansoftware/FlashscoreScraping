import { Test, TestingModule } from '@nestjs/testing';
import { FlashscoreService } from './flashscore.service';

describe('FlashscoreService', () => {
  let service: FlashscoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashscoreService],
    }).compile();

    service = module.get<FlashscoreService>(FlashscoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
