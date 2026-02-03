import {
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductsQueryDto {
  @ApiPropertyOptional({ example: '1', description: 'Pagina curentă' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Număr de iteme per pagină' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: 'laptop', description: 'Căutare text' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2', description: 'Filtrare după categoryId' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '100', description: 'Preț minim' })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional({ example: '500', description: 'Preț maxim' })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Disponibilitate: true = în stoc, false = fără stoc',
  })
  @IsOptional()
  @IsString()
  available?: string;

  @ApiPropertyOptional({
    example: 'price,name,category.name',
    description: 'Sortare multi-column',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'asc,desc,asc',
    description: 'Ordinea pentru fiecare câmp sortat',
  })
  @IsOptional()
  @IsString()
  order?: string;

  @ApiPropertyOptional({
    example: 'popular',
    description:
      'Preseturi: newest, oldest, cheapest, expensive, alphabetical, reverse_alpha, in_stock_first, out_of_stock_first, popular, trending, recommended, best_sellers',
  })
  @IsOptional()
  @IsString()
  preset?: string;
}
