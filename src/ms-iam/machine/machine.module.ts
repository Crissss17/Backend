// src/machines/machine.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { Machine, MachineSchema } from './machine.schema';
import { Area, AreaSchema } from '../area/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Machine.name, schema: MachineSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService, MongooseModule], 
})
export class MachineModule {}
