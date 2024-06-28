import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';
import { Dataset, DatasetSchema } from './schemas/dataset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]),
  ],
  controllers: [DatasetController],
  providers: [DatasetService],
})
export class DatasetModule {}
