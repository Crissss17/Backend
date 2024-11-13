import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Area } from '../area/area.schema';

@Schema()
export class Machine {
  @Prop({ required: true })
  name: string;

  @Prop()
  model?: string;

  @Prop({ default: 'activo' })
  status: string;

  @Prop({ type: String, ref: 'Area', required: true }) 
  area_id: string;
}


export const MachineSchema = SchemaFactory.createForClass(Machine);