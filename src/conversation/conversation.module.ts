import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule, // 🔥 OBLIGATORIU pentru req.user
  ],
  controllers: [ConversationController],
  providers: [ConversationService, PrismaService],
})
export class ConversationModule {}
