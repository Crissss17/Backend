import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Area } from '../area/area.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: number;

  @Prop()
  address: string;

  @Prop()
  addressAdditional: string;

  @Prop({ type: String, ref: 'Area', required: true }) 
  area_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
