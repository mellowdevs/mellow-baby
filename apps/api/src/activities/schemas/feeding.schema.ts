import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Baby } from '../../babies/schemas/baby.schema';

export type FeedingDocument = HydratedDocument<Feeding>;

export enum FeedingType {
  BREASTFEEDING = 'breastfeeding',
  BOTTLE = 'bottle',
}

export enum BreastfeedingSide {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum BottleContents {
  BREAST_MILK = 'breastMilk',
  RIGHT = 'formula',
}

/**
 * Represents a single feeding session record.
 */
@Schema({ timestamps: true })
export class Feeding {
  /**
   * The baby this record belongs to.
   * @type {Baby}
   * @memberof Feeding
   */
  @Prop({ type: Types.ObjectId, ref: 'Baby', required: true, index: true })
  baby: Baby;

  /**
   *The tyoe of feeding session
   *
   * @type {FeedingType}
   * @memberof Feeding
   */
  @Prop({ required: true, enum: Object.values(FeedingType) })
  type: FeedingType;

  /**
   * The exact time the feeding session started.
   * @type {Date}
   * @memberof Feeding
   */
  @Prop({ required: true })
  startTime: Date;
  /**
   * Any additional notes about the session.
   */
  @Prop()
  notes?: string;

  // --- Breastfeeding-specific fields ---

  /**
   * Duration of the breastfeeding session in seconds.
   */
  @Prop()
  duration?: number;

  /**
   * The last side used during breastfeeding.
   */
  @Prop({ enum: Object.values(BreastfeedingSide) })
  lastSide?: BreastfeedingSide;

  // --- Bottle-specific fields ---

  /**
   * The amount of liquid consumed, ALWAYS stored in milliliters (ml).
   */
  @Prop()
  amount?: number;

  /**
   * The contents of the bottle.
   */
  @Prop({ enum: Object.values(BottleContents) })
  contents?: BottleContents;

  /**
   * The brand of formula
   */
  @Prop()
  formulBrand?: string;
}

export const FeedingSchema = SchemaFactory.createForClass(Feeding);
