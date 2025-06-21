import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Create a mock AuthService
  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // We can mock guards for controller tests
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const user = { name: 'Test', email: loginDto.email, userId: '123' };
    const token = { access_token: 'fake-token' };

    it('should return an access token on successful login', async () => {
      (service.validateUser as jest.Mock).mockResolvedValue(user);
      (service.login as jest.Mock).mockResolvedValue(token);

      const result = await controller.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(token);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      // Simulate validateUser returning null
      (service.validateUser as jest.Mock).mockResolvedValue(null);

      // Expect the controller method to throw the exception
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', async () => {
      const mockRequest = { user: { name: 'Test', userId: '123' } };
      const result = await controller.getProfile(mockRequest);
      expect(result).toEqual(mockRequest.user);
    });
  });
});
