import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PusherService } from '../pusher/pusher.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService, PusherService],
})
export class MessageModule {}
