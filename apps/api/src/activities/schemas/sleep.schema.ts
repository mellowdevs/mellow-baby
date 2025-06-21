import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Baby } from '../../babies/schemas/baby.schema';

export type SleepDocument = HydratedDocument<Sleep>;

/**
 * Represents a single sleep cycle record for a baby
 */
@Schema({ timestamps: true })
export class Sleep {
  /**
   * The baby this record belongs to.
   * @type {Baby}
   * @memberof Feeding
   */
  @Prop({ type: Types.ObjectId, ref: 'Baby', required: true, index: true })
  baby: Baby;

  /**
   * The exact time the feeding session started.
   * @type {Date}
   * @memberof Feeding
   */
  @Prop({ required: true })
  startTime: Date;

  /**
   * The exact time the sleep session ended.
   * This is optional if the sleep session is currently ongoing.
   */
  @Prop()
  end?: Date;

  /**
   * Any additional notes about the sleep session.
   */
  @Prop()
  notes?: string;
}

export const SleepSchema = SchemaFactory.createForClass(Sleep);
