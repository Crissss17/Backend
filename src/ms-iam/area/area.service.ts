import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './area.schema';
import { CreateAreaDto } from './dto/createArea.dto';
import { UpdateAreaDto } from './dto/updateArea.dto';


@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  create(createAreaDto: CreateAreaDto): Promise<Area> {
    const createdArea = new this.areaModel(createAreaDto);
    return createdArea.save();
  }

  findAll(): Promise<Area[]> {
    return this.areaModel.find().exec();
  }

  findOne(name: string){
    return this.areaModel.findById(name).exec(); 
  }

  update(name: string, updateAreaDto: UpdateAreaDto) {
    return this.areaModel.findByIdAndUpdate(name, updateAreaDto, { new: true }).exec();
  }

  remove(name: string) {
    return this.areaModel.findByIdAndDelete(name).exec();
  }
}
