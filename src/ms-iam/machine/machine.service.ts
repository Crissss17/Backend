import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Machine} from './machine.schema';
import { CreateMachineDto } from './dto/createMachine.dto';
import { UpdateMachineDto } from './dto/updateMachine.dto';

@Injectable()
export class MachineService {
  constructor(@InjectModel(Machine.name) private machineModel: Model<Machine>) {}

  create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const createdMachine = new this.machineModel(createMachineDto);
    return createdMachine.save();
  }

  findAll(): Promise<Machine[]> {
    return this.machineModel.find().exec();
  }

  findOne(id: string): Promise<Machine | null> {
    return this.machineModel.findById(id).exec();
  }

  findByArea(area_id: string): Promise<Machine[]> {
    return this.machineModel.find({ area_id }).exec();
  }

  update(id: string, updateMachineDto: UpdateMachineDto): Promise<Machine | null> {
    return this.machineModel.findByIdAndUpdate(id, updateMachineDto, { new: true }).exec();
  }

  remove(id: string): Promise<Machine | null> {
    return this.machineModel.findByIdAndDelete(id).exec();
  }
}
