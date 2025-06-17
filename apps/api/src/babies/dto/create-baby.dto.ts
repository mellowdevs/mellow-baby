import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

import { Gender } from '../schemas/baby.schema';

export class CreateBabyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
