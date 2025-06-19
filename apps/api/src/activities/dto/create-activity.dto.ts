import { IsEnum, IsDateString, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { FeedingType, BreastfeedingSide, BottleContents } from '../schemas/feeding.schema';
import { DiaperType, PooColor, PooConsistency } from '../schemas/diaper.schema';

export class CreateActivityDto {
  // --- Common Fields ---
  @IsDateString()
  @IsOptional()
  startTime?: Date; // For Feeding & Sleep

  @IsDateString()
  @IsOptional()
  time?: Date; // For Diaper

  @IsString()
  @IsOptional()
  notes?: string;

  // --- Feeding-specific Fields ---
  @IsEnum(FeedingType)
  @IsOptional()
  feedingType?: FeedingType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number; // in seconds

  @IsEnum(BreastfeedingSide)
  @IsOptional()
  lastSide?: BreastfeedingSide;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number; // in ml

  @IsEnum(BottleContents)
  @IsOptional()
  contents?: BottleContents;

  // --- Sleep-specific Fields ---
  @IsDateString()
  @IsOptional()
  end?: Date;

  // --- Diaper-specific Fields ---
  @IsEnum(DiaperType)
  @IsOptional()
  diaperType?: DiaperType;

  @IsEnum(PooColor)
  @IsOptional()
  pooColor?: PooColor;

  @IsEnum(PooConsistency)
  @IsOptional()
  pooConsistency?: PooConsistency;
}
