import { Test, TestingModule } from '@nestjs/testing';
import { BabiesService } from './babies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Baby } from './schemas/baby.schema';
import { Model, Types } from 'mongoose';

const mockBaby = {
  _id: 'a-mock-baby-id',
  name: 'Test Baby',
  dateOfBirth: new Date(),
  user: 'a-mock-user-id',
};

// Our standard mock model for the Baby schema
const mockBabyModel = {
  create: jest.fn().mockResolvedValue(mockBaby),
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockBaby]),
  }),
};

describe('BabiesService', () => {
  let service: BabiesService;
  let model: Model<Baby>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BabiesService,
        {
          provide: getModelToken(Baby.name),
          useValue: mockBabyModel,
        },
      ],
    }).compile();

    service = module.get<BabiesService>(BabiesService);
    model = module.get<Model<Baby>>(getModelToken(Baby.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call babyModel.create with user and dto data', async () => {
      const createBabyDto = { name: 'Test Baby', dateOfBirth: new Date() };
      const userId = new Types.ObjectId().toHexString();
      const result = await service.create(createBabyDto, userId);

      expect(model.create).toHaveBeenCalledWith({
        ...createBabyDto,
        user: userId,
      });
      expect(result).toEqual(mockBaby);
    });
  });

  describe('findAllForUser', () => {
    it('should call babyModel.find with the correct user id', async () => {
      const userId = new Types.ObjectId().toHexString();
      const result = await service.findAllForUser(userId);

      expect(model.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual([mockBaby]);
    });
  });
});
