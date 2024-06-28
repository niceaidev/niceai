import { Injectable, Module } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Dataset } from './schemas/dataset.schema';

@Injectable()
export class DatasetService {
  constructor(@InjectModel(Dataset.name) private dataset: Model<Dataset>) {}

  async getInfo() {
    const dataset = new this.dataset({
      title: '1',
      content: 'Hello World!',
    });
    await dataset.save();
    return dataset;
  }
}
