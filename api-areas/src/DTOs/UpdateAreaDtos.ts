// src/dtos/UpdateAreaDto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateAreaDto {
    @IsString()
    @IsOptional()
    name?: string;
}