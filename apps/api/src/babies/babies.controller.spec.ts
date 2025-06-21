import { Test, TestingModule } from '@nestjs/testing';
import { BabiesController } from './babies.controller';
import { BabiesService } from './babies.service';
import { ActivitiesService } from '../activities/activities.service';
import { AuthGuard } from '@nestjs/passport';

// Mock the services
const mockBabiesService = {
  create: jest.fn(),
  findAllForUser: jest.fn(),
};
const mockActivitiesService = {
  createSleep: jest.fn(),
};

// Mock the guard
const mockAuthGuard = { canActivate: jest.fn(() => true) };

describe('BabiesController', () => {
  let controller: BabiesController;
  let babiesService: BabiesService;
  let activitiesService: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BabiesController],
      providers: [
        { provide: BabiesService, useValue: mockBabiesService },
        { provide: ActivitiesService, useValue: mockActivitiesService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<BabiesController>(BabiesController);
    babiesService = module.get<BabiesService>(BabiesService);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (baby)', () => {
    it('should call babiesService.create with dto and userId', () => {
      const dto = { name: 'Test', dateOfBirth: new Date() };
      const req = { user: { userId: 'user-123' } };
      controller.create(dto, req);
      expect(babiesService.create).toHaveBeenCalledWith(dto, 'user-123');
    });
  });

  describe('findAll (babies)', () => {
    it('should call babiesService.findAllForUser with userId', () => {
      const req = { user: { userId: 'user-123' } };
      controller.findAll(req);
      expect(babiesService.findAllForUser).toHaveBeenCalledWith('user-123');
    });
  });

  describe('createSleep', () => {
    it('should call activitiesService.createSleep with dto, babyId, and userId', () => {
      const dto = { startTime: new Date() };
      const babyId = 'baby-456';
      const req = { user: { userId: 'user-123' } };
      controller.createSleep(babyId, dto, req);
      expect(activitiesService.createSleep).toHaveBeenCalledWith(dto, babyId, 'user-123');
    });
  });
});
