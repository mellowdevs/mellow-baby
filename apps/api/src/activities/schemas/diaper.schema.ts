import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Baby } from 'src/babies/schemas/baby.schema';

export type DiaperDocument = HydratedDocument<Diaper>;

// Enums for type-safety and i18n
export enum DiaperType {
  WET = 'wet',
  DIRTY = 'dirty',
  MIXED = 'mixed',
}

export enum PooColor {
  BROWN = 'brown',
  GREEN = 'green',
  YELLOW = 'yellow',
  BLACK = 'black',
  RED = 'red',
}

export enum PooConsistency {
  RUNNY = 'runny',
  SOFT = 'soft',
  SEEDY = 'seedy',
  FORMED = 'formed',
  HARD = 'hard',
}

/**
 * Represents a single diaper change record.
 */
@Schema({ timestamps: true })
export class Diaper {
  /**
   * The baby this record belongs to.
   */
  @Prop({ type: Types.ObjectId, ref: 'Baby', required: true, index: true })
  baby: Baby;

  /**
   * The exact time of the diaper change.
   */
  @Prop({ required: true })
  time: Date;

  /**
   * The type of diaper change (wet, dirty, or both).
   */
  @Prop({ required: true, enum: Object.values(DiaperType) })
  type: DiaperType;

  /**
   * Any additional notes about the diaper change.
   */
  @Prop()
  notes?: string;

  /**
   * The color of the poo, if the diaper type is 'dirty' or 'mixed'.
   */
  @Prop({ enum: Object.values(PooColor) })
  pooColor?: PooColor;

  /**
   * The consistency of the poo, if the diaper type is 'dirty' or 'mixed'.
   */
  @Prop({ enum: Object.values(PooConsistency) })
  pooConsistency?: PooConsistency;
}

export const DiaperSchema = SchemaFactory.createForClass(Diaper);
