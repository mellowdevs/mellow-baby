import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { AuthGuard } from '@nestjs/passport';

// Mock the entire ActivitiesService
const mockActivitiesService = {
  findAllForUser: jest.fn().mockResolvedValue([]),
  remove: jest.fn().mockResolvedValue(undefined),
};

// Mock the guard to always allow access for controller tests
const mockAuthGuard = { canActivate: jest.fn(() => true) };

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service = module.get<ActivitiesService>(ActivitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAllForUser with the userId from the request', async () => {
      const mockRequest = { user: { userId: 'user-123' } };
      await controller.findAll(mockRequest);
      expect(service.findAllForUser).toHaveBeenCalledWith('user-123');
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct parameters from param, query, and request', async () => {
      const mockRequest = { user: { userId: 'user-123' } };
      const activityId = 'activity-abc';
      const activityType = 'sleep' as any;

      await controller.remove(activityId, activityType, mockRequest);
      expect(service.remove).toHaveBeenCalledWith(activityId, activityType, 'user-123');
    });
  });
});
