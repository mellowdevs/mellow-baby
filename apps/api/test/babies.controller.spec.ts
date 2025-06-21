import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { ActivitiesService } from '../src/activities/activities.service';
import { AppModule } from '../src/app.module';
import { BabiesService } from '../src/babies/babies.service';

// This is our mock user that the guard will return
const mockUser = {
  userId: 'mock-user-id-123',
  email: 'test@e2e.com',
  name: 'Test User',
};

// This mock guard always allows access and attaches the mock user
const mockJwtAuthGuard = {
  canActivate: (context) => {
    const req = context.switchToHttp().getRequest();
    req.user = mockUser;
    return true;
  },
};

describe('BabiesController (Integration with Mocks)', () => {
  let app: INestApplication;
  let jwtToken: string;

  // Create mock services with Jest's function mock
  const mockBabiesService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
  };

  const mockActivitiesService = {
    createSleep: jest.fn(),
    createFeeding: jest.fn(),
    createDiaper: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BabiesService) // Find the real BabiesService
      .useValue(mockBabiesService) // And replace it with our mock
      .overrideProvider(ActivitiesService) // Find the real ActivitiesService
      .useValue(mockActivitiesService) // And replace it with our mock
      .overrideGuard(AuthGuard('jwt')) // Find the real JwtAuthGuard
      .useValue(mockJwtAuthGuard) // And replace it with our mock guard
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user for the test
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Test User', email: 'test@e2e.com', password: 'Password123' });

    // Log in as that user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@e2e.com', password: 'Password123' });

    // Get the token from the response body and save it to our variable
    jwtToken = loginResponse.body.access_token; // <-- ASSIGNED HERE
  });

  afterAll(async () => {
    await app.close();
  });

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call babiesService.create with correct data (POST /babies)', async () => {
    const createBabyDto = { name: 'Mock Baby', dateOfBirth: '2025-01-01' };

    // We mock the return value for this test
    mockBabiesService.create.mockResolvedValue({ _id: 'mock-baby-id', ...createBabyDto });

    await request(app.getHttpServer()).post('/babies').send(createBabyDto).expect(201);

    // This is the most important part: we check if our service was called correctly
    expect(mockBabiesService.create).toHaveBeenCalledWith(createBabyDto, mockUser.userId);
  });

  it('should create a new sleep record and return it with a date string', async () => {
    const now = new Date();
    const createSleepDto = { start: now, notes: 'test nap' };

    // We mock the service to return a document that has a real Date object,
    // which mimics the behavior of Mongoose.
    mockActivitiesService.createSleep.mockResolvedValue({
      _id: 'mock-sleep-id',
      baby: 'some-baby-id',
      ...createSleepDto,
    });

    return request(app.getHttpServer())
      .post('/babies/some-baby-id/sleeps')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(createSleepDto)
      .expect(201)
      .then((response) => {
        // We check that the response body's `start` property is a string...
        expect(response.body).toHaveProperty('start');
        expect(typeof response.body.start).toBe('string');
        // ...and that it matches the ISO string version of our original date.
        expect(response.body.start).toEqual(now.toISOString());
        expect(response.body.notes).toEqual('test nap');
      });
  });

  it('should call babiesService.findAllForUser for the logged-in user (GET /babies)', async () => {
    const mockBabies = [{ name: 'Mock Baby 1' }, { name: 'Mock Baby 2' }];
    mockBabiesService.findAllForUser.mockResolvedValue(mockBabies);

    await request(app.getHttpServer())
      .get('/babies')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(mockBabies);
      });

    expect(mockBabiesService.findAllForUser).toHaveBeenCalledWith(mockUser.userId);
  });
});
