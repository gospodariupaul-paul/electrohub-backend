import { Module } from '@nestjs/common';
import { ConversationController } from './conversation/conversation.controller';
import { ConversationService } from './conversation/conversation.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { PrismaService } from './prisma/prisma.service';
import { PusherService } from './pusher/pusher.service';

@Module({
  controllers: [
    ConversationController,
    MessageController,
  ],
  providers: [
    ConversationService,
    MessageService,
    PrismaService,
    PusherService,
  ],
})
export class AppModule {}
