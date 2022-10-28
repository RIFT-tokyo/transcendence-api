import { Test, TestingModule } from '@nestjs/testing';
import { PmsController } from './pms.controller';

describe('PmsController', () => {
  let controller: PmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmsController],
    }).compile();

    controller = module.get<PmsController>(PmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
