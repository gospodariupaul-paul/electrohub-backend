import { IsInt, IsString, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  categoryId: number;
}
