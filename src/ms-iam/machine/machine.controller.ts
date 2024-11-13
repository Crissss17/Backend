import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/createMachine.dto';
import { UpdateMachineDto } from './dto/updateMachine.dto';

@Controller('machines')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machineService.create(createMachineDto);
  }

  @Get()
  findAll() {
    return this.machineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machineService.findOne(id);
  }

  @Get('/area/:area_id')
  findByArea(@Param('area_id') area_id: string) {
    return this.machineService.findByArea(area_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    return this.machineService.update(id, updateMachineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machineService.remove(id);
  }
}
