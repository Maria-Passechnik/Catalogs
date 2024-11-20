import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatalogDocument = HydratedDocument<Catalog>;

@Schema({ timestamps: true })
export class Catalog {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    match: /^[a-zA-Z]+$/,
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Vertical is required'],
    enum: ['fashion', 'home', 'general'],
  })
  vertical: 'fashion' | 'home' | 'general';

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isPrimary: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  locales: string[];

  @Prop({
    type: Date,
    default: null,
  })
  indexedAt: Date;

  @Prop({
    type: Number,
    default: 0,
  })
  version: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  locked: boolean;
  
}

export const CatalogSchema = SchemaFactory.createForClass(Catalog);

CatalogSchema.index(
  { vertical: 1, isPrimary: 1 },
  { unique: true, partialFilterExpression: { isPrimary: true } },
);
