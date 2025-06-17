import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BabiesController } from './babies.controller';
import { BabiesService } from './babies.service';
import { Baby, BabySchema } from './schemas/baby.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Baby.name, schema: BabySchema }])],
  controllers: [BabiesController],
  providers: [BabiesService],
})
export class BabiesModule {}
