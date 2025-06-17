import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';
import { Baby, BabyDocument } from './schemas/baby.schema';

@Injectable()
export class BabiesService {
  constructor(@InjectModel(Baby.name) private babyModel: Model<BabyDocument>) {}

  /**
   * Creates a new baby profile for a given user.
   * @param createBabyDto - The data for the new baby.
   * @param userId - The ID of the parent user.
   * @returns The saved baby document.
   */
  create(createBabyDto: CreateBabyDto, userId: string): Promise<Baby> {
    const babyData = { ...createBabyDto, user: userId };
    const createdBaby = new this.babyModel(babyData);
    return createdBaby.save();
  }

  /**
   * Finds all babies belonging to a specific user.
   * @param userId - The ID of the parent user.
   * @returns A list of the user's babies.
   */
  findAllForUser(userId: string): Promise<Baby[]> {
    return this.babyModel.find({ user: userId }).exec();
  }

  findAll() {
    return `This action returns all babies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} baby`;
  }

  update(id: number, updateBabyDto: UpdateBabyDto) {
    return `This action updates a #${id} baby`;
  }

  remove(id: number) {
    return `This action removes a #${id} baby`;
  }
}
