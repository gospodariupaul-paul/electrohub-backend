import { Module } from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service';
import { SavedSearchesController } from './saved-searches.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SavedSearchesController],
  providers: [SavedSearchesService, PrismaService],
})
export class SavedSearchesModule {}
