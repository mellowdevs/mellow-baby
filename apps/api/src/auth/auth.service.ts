import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

/**
 * AuthService handles the core authentication logic
 * such as valdiating users and issueing JSON Web Tokens
 */
@Injectable()
export class AuthService {
  /**
   * Injects dependencies for UserService and JwtService
   * @param usersService - Service for user-related database operations.
   * @param jwtService - Service for creating and managing JWTs.
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials against the database
   * @param email - The email of the user to validate.
   * @param password - The password of the user to validate.
   * @returns The user object without the password if validation is successful, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<unknown> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * Generates a JWT access token for a validates user.
   * @param user - The user object for whom to generate a token.
   * @returns An object containing the JWT token.
   */
  async login(user: any): Promise<any> {
    const payload = { email: user.email, sub: user._id, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }
}
