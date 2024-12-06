import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasController } from './area.controller';
import { AreasService } from './area.service';
import { Area, AreaSchema } from './area.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }])],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule {}
