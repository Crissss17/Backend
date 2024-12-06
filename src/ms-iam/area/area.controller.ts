import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreasService } from './area.service';
import { CreateAreaDto } from './dto/createArea.dto';
import { UpdateAreaDto } from './dto/updateArea.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  async create(@Body() createAreaDto: CreateAreaDto) {
    return await this.areasService.create(createAreaDto);
  }

  @Get()
  async findAll() {
    return await this.areasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.areasService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return await this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.areasService.remove(id);
  }
}
