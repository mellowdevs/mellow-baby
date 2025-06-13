import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   *
   * The email address of the user
   * @example 'test@example.com'
   */
  @ApiProperty({ example: 'test@example.com', description: "User's email address" })
  email: string;

  /**
   *
   * The name of the user
   * @example 'Mellow'
   */
  @ApiProperty({ example: 'Mellow', description: "User's name" })
  name: string;

  /**
   *
   * The user's password
   * @example 'password123'
   */
  @ApiProperty({ example: 'password123', description: "User's raw password" })
  password: string;
}
