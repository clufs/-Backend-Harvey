import { Test, TestingModule } from '@nestjs/testing';
import { RegularCottonShirtController } from './regular_cotton_shirt.controller';
import { RegularCottonShirtService } from './regular_cotton_shirt.service';

describe('RegularCottonShirtController', () => {
  let controller: RegularCottonShirtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegularCottonShirtController],
      providers: [RegularCottonShirtService],
    }).compile();

    controller = module.get<RegularCottonShirtController>(RegularCottonShirtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
