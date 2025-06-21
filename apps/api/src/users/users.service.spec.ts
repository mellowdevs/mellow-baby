import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ConflictException } from '@nestjs/common';

// A simple mock for the Mongoose Model, only including methods we use.
const mockUserModel = {
  create: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call userModel.create and return the user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { ...createUserDto, _id: 'a-mock-id' };

      // For this test, make findOne return null (user doesn't exist)
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Make the create method return our expected user
      (model.create as jest.Mock).mockResolvedValue(expectedResult as any);

      const result = await service.create(createUserDto);

      expect(model.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw a ConflictException if email already exists', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // For this test, make findOne return an existing user
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
      });

      // Expect the service call to be rejected with a ConflictException
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findUserByEmail', () => {
    it('should call model.findOne and return a user', async () => {
      const user = { name: 'Test', email: 'test@example.com' };
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      await service.findUserByEmail('test@example.com');
      expect(model.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });
});
