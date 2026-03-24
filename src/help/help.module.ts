import { Module } from '@nestjs/common';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [HelpController],
  providers: [HelpService, PrismaService],
})
export class HelpModule {}
