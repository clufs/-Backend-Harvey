import { Test, TestingModule } from '@nestjs/testing';
import { RegularCottonShirtService } from './regular_cotton_shirt.service';

describe('RegularCottonShirtService', () => {
  let service: RegularCottonShirtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegularCottonShirtService],
    }).compile();

    service = module.get<RegularCottonShirtService>(RegularCottonShirtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
