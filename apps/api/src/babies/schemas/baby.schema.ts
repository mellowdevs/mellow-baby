import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type BabyDocument = HydratedDocument<Baby>;

// Enum for Gender
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Baby {
  /**
   * The user who owns this baby profile.
   * @type {User}
   * @memberof Baby
   */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User;

  /**
   * The baby's name.
   */
  @Prop({ required: true })
  name: string;

  /**
   * The baby's date of birth.
   */
  @Prop({ required: true })
  dateOfBirth: Date;

  /**
   * The baby's name.
   */
  @Prop({ type: String, enum: Object.values(Gender) })
  gender?: Gender;
}

export const BabySchema = SchemaFactory.createForClass(Baby);
