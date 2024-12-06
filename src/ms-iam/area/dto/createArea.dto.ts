import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  _id: string; 

  @IsOptional()
  description?: string;
}
