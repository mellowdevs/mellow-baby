import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { Diaper, DiaperSchema } from './schemas/diaper.schema';
import { Feeding, FeedingSchema } from './schemas/feeding.schema';
import { Sleep, SleepSchema } from './schemas/sleep.schema';
import { Baby, BabySchema } from '../babies/schemas/baby.schema';

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
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  // We export the service AND the mongoose models to make them available to other modules
  // (like our BabiesModule)
  exports: [ActivitiesService, mongooseFeatures],
})
export class ActivitiesModule {}
