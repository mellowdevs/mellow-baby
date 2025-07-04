import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UnitSystem {
  METRIC = 'metric', // ml
  IMPERIAL = 'imperial', // oz
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UnitSystem),
    default: UnitSystem.METRIC,
  })
  preferredUnitSystem: UnitSystem;
}

export const UserSchema = SchemaFactory.createForClass(User);

// This is a "pre-save hook". Before any user document is saved,
// this function will run to hash the password automatically.
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
