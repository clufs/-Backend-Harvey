import { Test, TestingModule } from '@nestjs/testing';
import { HatsService } from './hats.service';

describe('HatsService', () => {
  let service: HatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HatsService],
    }).compile();

    service = module.get<HatsService>(HatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
