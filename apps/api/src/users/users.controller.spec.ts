import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// Create a mock UsersService with a fake 'create' method
const mockUsersService = {
  create: jest.fn((dto) => {
    return {
      _id: 'a-mock-id',
      ...dto,
    };
  }),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService, // Use our mock service instead of the real one
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (register endpoint)', () => {
    it('should call usersService.create with the correct DTO', () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      controller.create(createUserDto);
      // We expect that the create method on our mock service was called with the data from the controller
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
