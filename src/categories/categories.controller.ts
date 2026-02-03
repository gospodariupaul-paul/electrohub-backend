import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Returnează toate categoriile' })
  @ApiResponse({
    status: 200,
    description: 'Lista tuturor categoriilor',
    schema: {
      example: [
        { id: 1, name: 'Laptopuri' },
        { id: 2, name: 'Telefoane' },
      ],
    },
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Creează o categorie nouă' })
  @ApiResponse({
    status: 201,
    description: 'Categoria a fost creată',
    schema: {
      example: { id: 1, name: 'Laptopuri' },
    },
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizează o categorie' })
  @ApiResponse({
    status: 200,
    description: 'Categoria actualizată',
    schema: {
      example: { id: 1, name: 'Laptopuri Gaming' },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Șterge o categorie' })
  @ApiResponse({
    status: 200,
    description: 'Categoria a fost ștearsă',
    schema: {
      example: { message: 'Category deleted successfully' },
    },
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
