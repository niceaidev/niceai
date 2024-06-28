import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DatasetDocument = HydratedDocument<Dataset>;

@Schema()
export class Dataset {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const DatasetSchema = SchemaFactory.createForClass(Dataset);
