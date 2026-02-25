import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

// Conversații
import { ConversationController } from './conversation/conversation.controller';
import { ConversationService } from './conversation/conversation.service';

// Mesaje
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

// Pusher
import { PusherService } from './pusher/pusher.service';

@Module({
  imports: [],
  controllers: [
    ConversationController,
    MessageController,
  ],
  providers: [
    PrismaService,
    ConversationService,
    MessageService,
    PusherService,
  ],
})
export class AppModule {}
