import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service';

@Controller('saved-searches')
export class SavedSearchesController {
  constructor(private service: SavedSearchesService) {}

  @Post()
  create(@Body() body: any) {
    const userId = 1; // TODO: înlocuiești cu user-ul logat
    return this.service.create(userId, body.query, body.filters);
  }

  @Get()
  findAll() {
    const userId = 1; // TODO: înlocuiești cu user-ul logat
    return this.service.findAll(userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const userId = 1; // TODO: înlocuiești cu user-ul logat
    return this.service.delete(Number(id), userId);
  }

  // ⭐ ȘTERGE TOT
  @Delete()
  deleteAll() {
    const userId = 1; // TODO: înlocuiești cu user-ul logat
    return this.service.deleteAll(userId);
  }
}
