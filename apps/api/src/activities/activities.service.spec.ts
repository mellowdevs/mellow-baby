import { ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';

import { ActivitiesService } from './activities.service';
import { Diaper, DiaperType } from './schemas/diaper.schema';
import { Feeding, FeedingType } from './schemas/feeding.schema';
import { Sleep } from './schemas/sleep.schema';
import { Baby } from '../babies/schemas/baby.schema';

const createMockQuery = (resolvedValue: any) => ({
  select: jest.fn().mockReturnThis(), // select returns 'this' for chaining
  exec: jest.fn().mockResolvedValue(resolvedValue), // exec resolves with the provided value
});

// This is our universal mock for any Mongoose Model.
// We will control its behavior in each test.
const createMockModel = (defaultFindValue: any = []) => ({
  create: jest.fn(),
  find: jest.fn().mockReturnValue(createMockQuery(defaultFindValue)), // Default find returns a chainable query
  findOne: jest.fn().mockReturnValue(createMockQuery(null)), // Default findOne returns a chainable query resolving to null
  findById: jest.fn().mockReturnValue(createMockQuery(null)),
  findByIdAndDelete: jest.fn().mockReturnValue(createMockQuery(null)),
});

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let babyModel: Model<Baby>;
  let sleepModel: Model<Sleep>;
  let feedingModel: Model<Feeding>;
  let diaperModel: Model<Diaper>;

  let mockBabyModel: any;

  beforeEach(async () => {
    mockBabyModel = createMockModel(); // Baby model needs its own mock too

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        { provide: getModelToken(Sleep.name), useValue: createMockModel() },
        { provide: getModelToken(Feeding.name), useValue: createMockModel() },
        { provide: getModelToken(Diaper.name), useValue: createMockModel() },
        { provide: getModelToken(Baby.name), useValue: createMockModel() },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    babyModel = module.get<Model<Baby>>(getModelToken(Baby.name));
    sleepModel = module.get<Model<Sleep>>(getModelToken(Sleep.name));
    feedingModel = module.get<Model<Feeding>>(getModelToken(Feeding.name));
    diaperModel = module.get<Model<Diaper>>(getModelToken(Diaper.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = new Types.ObjectId().toHexString();
  const babyId = new Types.ObjectId().toHexString();

  describe('createSleep', () => {
    it('should throw ForbiddenException if ownership check fails', async () => {
      // For this test, make findOne().exec() resolve to null
      (babyModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.createSleep({}, 'babyId', 'userId')).rejects.toThrow(ForbiddenException);
    });

    it('should call sleepModel.create with correct data on success', async () => {
      // For this test, make ownership check pass
      (babyModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      const dto = { startTime: new Date() };
      const babyId = new Types.ObjectId().toHexString();
      await service.createSleep(dto, babyId, 'userId');

      expect(sleepModel.create).toHaveBeenCalledWith({
        ...dto,
        baby: new Types.ObjectId(babyId),
      });
    });
  });

  describe('createFeeding', () => {
    it('should throw ForbiddenException if ownership check fails', async () => {
      (babyModel.findOne as jest.Mock).mockReturnValue(createMockQuery(null));
      await expect(service.createFeeding({}, babyId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('should call feedingModel.create with correct data on success', async () => {
      (babyModel.findOne as jest.Mock).mockReturnValue(createMockQuery(true));
      const dto = { feedingType: FeedingType.BOTTLE, amount: 120, startTime: new Date() };
      await service.createFeeding(dto, babyId, userId);
      expect(feedingModel.create).toHaveBeenCalledWith({
        ...dto,
        baby: new Types.ObjectId(babyId),
      });
    });
  });

  // --- NEW TEST CASE FOR createDiaper ---
  describe('createDiaper', () => {
    it('should throw ForbiddenException if ownership check fails', async () => {
      (babyModel.findOne as jest.Mock).mockReturnValue(createMockQuery(null));
      await expect(service.createDiaper({}, babyId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('should call diaperModel.create with correct data on success', async () => {
      (babyModel.findOne as jest.Mock).mockReturnValue(createMockQuery(true));
      const dto = { time: new Date(), diaperType: DiaperType.WET };
      await service.createDiaper(dto, babyId, userId);
      expect(diaperModel.create).toHaveBeenCalledWith({ ...dto, baby: new Types.ObjectId(babyId) });
    });
  });

  describe('findAllForUser', () => {
    it('should find all activities for a user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const babyId = new Types.ObjectId();
      const mockBabies = [{ _id: babyId }];
      const mockSleeps = [{ start: new Date() }];

      // Setup the mock chain for finding babies
      (babyModel.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBabies),
      });

      // Setup the mock chain for finding sleeps
      (sleepModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSleeps),
      });

      // Make the other activity models return empty arrays
      (createMockModel().find as jest.Mock)
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(mockSleeps) })
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue([]) })
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue([]) });
      mockBabyModel.find.mockReturnValue(createMockQuery(mockBabies));

      const result = await service.findAllForUser(userId);

      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('start');
    });
  });

  describe('remove', () => {
    it('should call findByIdAndDelete on the correct model', async () => {
      const activityId = new Types.ObjectId().toHexString();
      const babyId = new Types.ObjectId().toHexString();
      const userId = new Types.ObjectId().toHexString();
      const mockActivity = { _id: activityId, baby: babyId };

      // Setup mock chain for finding the activity to delete
      (sleepModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockActivity),
      });

      // Setup mock chain for the ownership check
      (babyModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      // Setup mock chain for the delete operation
      (sleepModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      await service.remove(activityId, 'sleep', userId);

      // Expect that the delete function was called on the correct model
      expect(sleepModel.findByIdAndDelete).toHaveBeenCalledWith(activityId);
    });
  });
});
