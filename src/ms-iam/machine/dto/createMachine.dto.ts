import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMachineDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  model?: string;

  @IsNotEmpty()
  area_id: string; 
}
