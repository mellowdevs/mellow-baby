import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesService } from 'src/activities/activities.service';
import { Diaper, DiaperSchema } from 'src/activities/schemas/diaper.schema';
import { Feeding, FeedingSchema } from 'src/activities/schemas/feeding.schema';
import { Sleep, SleepSchema } from 'src/activities/schemas/sleep.schema';

import { BabiesController } from './babies.controller';
import { BabiesService } from './babies.service';
import { Baby, BabySchema } from './schemas/baby.schema';

// Define the Mongoose feature module once as a constant for reusability
const mongooseFeatures = MongooseModule.forFeature([
  { name: Sleep.name, schema: SleepSchema },
  { name: Feeding.name, schema: FeedingSchema },
  { name: Diaper.name, schema: DiaperSchema },
  // We also need BabyModel for ownership checks inside ActivitiesService
  { name: Baby.name, schema: BabySchema },
]);

@Module({
  imports: [mongooseFeatures],
  controllers: [BabiesController],
  providers: [BabiesService, ActivitiesService],
})
export class BabiesModule {}
