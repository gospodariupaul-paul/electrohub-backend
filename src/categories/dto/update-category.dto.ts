import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;
}
