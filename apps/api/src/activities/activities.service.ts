import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateActivityDto } from './dto/create-activity.dto';
import { Diaper, DiaperDocument } from './schemas/diaper.schema';
import { Feeding, FeedingDocument } from './schemas/feeding.schema';
import { Sleep, SleepDocument } from './schemas/sleep.schema';
import { Baby, BabyDocument } from '../babies/schemas/baby.schema';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Sleep.name) private sleepModel: Model<SleepDocument>,
    @InjectModel(Feeding.name) private feedingModel: Model<FeedingDocument>,
    @InjectModel(Diaper.name) private diaperModel: Model<DiaperDocument>,
    @InjectModel(Baby.name) private babyModel: Model<BabyDocument>,
  ) {}

  /**
   * A private helper to verify that the baby belongs to the user making the request.
   * Throws a ForbiddenException if ownership check fails.
   * @param babyId - The ID of the baby to check.
   * @param userId - The ID of the user making the request.
   */
  private async _verifyBabyOwnership(babyId: string, userId: string): Promise<void> {
    const baby = await this.babyModel.findOne({ _id: babyId, user: userId }).exec();
    if (!baby) throw new ForbiddenException("You do not have access to this baby's records");
  }

  /**
   * Creates a new sleep record for a given baby after verifying ownership.
   * @param dto - The data for the new sleep record.
   * @param babyId - The ID of the baby this record belongs to.
   * @param userId - The ID of the user creating the record.
   */
  async createSleep(dto: CreateActivityDto, babyId: string, userId: string): Promise<Sleep> {
    await this._verifyBabyOwnership(babyId, userId);
    const sleepData = { ...dto, baby: new Types.ObjectId(babyId) };
    return this.sleepModel.create(sleepData);
  }
  /**
   * Creates a new feeding record for a given baby after verifying ownership.
   * @param dto - The data for the new feeding record.
   * @param babyId - The ID of the baby this record belongs to.
   * @param userId - The ID of the user creating the record.
   */
  async createFeeding(dto: CreateActivityDto, babyId: string, userId: string): Promise<Feeding> {
    await this._verifyBabyOwnership(babyId, userId);
    const feedingData = { ...dto, baby: new Types.ObjectId(babyId) };
    return this.feedingModel.create(feedingData);
  }

  /**
   * Creates a new diaper record for a given baby after verifying ownership.
   * @param dto - The data for the new diaper record.
   * @param babyId - The ID of the baby this record belongs to.
   * @param userId - The ID of the user creating the record.
   */
  async createDiaper(dto: CreateActivityDto, babyId: string, userId: string): Promise<Diaper> {
    await this._verifyBabyOwnership(babyId, userId);
    const diaperData = { ...dto, baby: new Types.ObjectId(babyId) };
    return this.diaperModel.create(diaperData);
  }

  /**
   * Finds all activities for all babies belonging to a specific user, sorted by time.
   * @param userId - The ID of the parent user.
   */
  async findAllForUser(userId: string): Promise<any[]> {
    const userBabies = await this.babyModel.find({ user: userId }).select('_id').exec();

    const babyIds = userBabies.map((b) => b._id);

    if (babyIds.length === 0) {
      return [];
    }

    const sleeps = await this.sleepModel.find({ baby: { $in: babyIds } }).exec();
    const feedings = await this.feedingModel.find({ baby: { $in: babyIds } }).exec();
    const diapers = await this.diaperModel.find({ baby: { $in: babyIds } }).exec();

    const allActivities = [...sleeps, ...feedings, ...diapers];

    allActivities.sort((a, b) => {
      const timeA = new Date((a as any).startTime || (a as any).start || (a as any).time);
      const timeB = new Date((b as any).startTime || (b as any).start || (b as any).time);
      return timeB.getTime() - new Date(timeA).getTime();
    });

    return allActivities;
  }

  /**
   * Removes a specific activity by its ID and type, after verifying ownership.
   * @param activityId - The ID of the activity to remove.
   * @param type - The type of activity ('sleep', 'feeding', 'diaper').
   * @param userId - The ID of the user requesting the deletion.
   */
  async remove(
    activityId: string,
    type: 'sleep' | 'feeding' | 'diaper',
    userId: string,
  ): Promise<void> {
    let model;

    // Use a switch statement to select the correct model
    switch (type) {
      case 'sleep':
        model = this.sleepModel;
        break;
      case 'feeding':
        model = this.feedingModel;
        break;
      case 'diaper':
        model = this.diaperModel;
        break;
      default:
        throw new NotFoundException('Invalid activity type.');
    }
    if (!model) throw new NotFoundException('Invalid activity type.');

    const activity = await model.findById(activityId).exec();
    if (!activity) throw new NotFoundException(`Activity with ID ${activityId} not found.`);

    await this._verifyBabyOwnership(activity.baby.toString(), userId);

    await model.findByIdAndDelete(activityId).exec();
  }
}
