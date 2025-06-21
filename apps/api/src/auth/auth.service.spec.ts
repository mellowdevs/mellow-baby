import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// We need to mock the bcrypt library
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    // Create mocks for the dependencies
    const mockUsersService = {
      findUserByEmail: jest.fn(),
    };
    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'hashedpassword',
      toObject: () => mockUser,
    };

    it('should return the user object if password is valid', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should return null if password is not valid', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simulate wrong password

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);
      const result = await service.validateUser('notfound@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { email: 'test@example.com', _id: 'some-id', name: 'Test' };
      const expectedToken = 'fake-jwt-token';
      (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
        name: user.name,
      });
      expect(result).toEqual({ access_token: expectedToken });
    });
  });
});
