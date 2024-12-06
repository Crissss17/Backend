import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './area.schema';
import { CreateAreaDto } from './dto/createArea.dto';
import { UpdateAreaDto } from './dto/updateArea.dto';


@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    try {
      const createdArea = new this.areaModel(createAreaDto);
      return await createdArea.save();
    } catch (error) {
      throw new BadRequestException('Error al crear el área');
    }
  }

  async findAll(): Promise<Area[]> {
    try {
      return await this.areaModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las áreas');
    }
  }

  async findOne(id: string): Promise<Area> {
    try {
      const area = await this.areaModel.findById(id).exec();
      if (!area) {
        throw new NotFoundException(`Área con id ${id} no encontrada`);
      }
      return area;
    } catch (error:any) {
      throw new BadRequestException(`Error al buscar el área: ${error.message}`);
    }
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    try {
      const updatedArea = await this.areaModel.findByIdAndUpdate(
        id,
        updateAreaDto,
        { new: true },
      );
      if (!updatedArea) {
        throw new NotFoundException(`Área con id ${id} no encontrada`);
      }
      return updatedArea;
    } catch (error) {
      throw new BadRequestException('Error al actualizar el área');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deletedArea = await this.areaModel.findByIdAndDelete(id);
      if (!deletedArea) {
        throw new NotFoundException(`Área con id ${id} no encontrada`);
      }
      return { message: 'Área eliminada correctamente' };
    } catch (error) {
      throw new BadRequestException('Error al eliminar el área');
    }
  }
}

