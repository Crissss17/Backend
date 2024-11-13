// src/areas/dto/update-area.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAreaDto } from './createArea.dto';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {}
