import { Test, TestingModule } from '@nestjs/testing';
import { ChannelUserPermissionsService } from './channel-user-permissions.service';

describe('ChannelUsersService', () => {
  let service: ChannelUserPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelUserPermissionsService],
    }).compile();

    service = module.get<ChannelUserPermissionsService>(
      ChannelUserPermissionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
