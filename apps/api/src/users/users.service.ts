import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

/**
 * The UsersService encapsulates the business logic for managing users,
 * including all interactions with the database's 'users' collection.
 */
@Injectable()
export class UsersService {
  /**
   * Injects the Mongoose Model for User schema to enable
   * interaction with the database
   * @param userModel - The Mongoose model for the User document
   */
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  /**
   * Creates and saves a new user in the database
   * Paswordd is automatically hashed by pre-save hook on the UserSchema
   * @param createUserDto - The DTO containing the new user data
   * @returns a promise that resolves to the newly created user document.
   * @throws {ConflictException} if a user with the same email aldready exists
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if a user with this email already exists
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) throw new ConflictException('Email already exists.');

    // If not, save the new user.
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  /**
   * Finds a single user by their email address.
   * @param email - the email of the user to find
   * @returns a promise that resolves to the Mongoose Document for the user if found, otherwise null.
   */
  findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
