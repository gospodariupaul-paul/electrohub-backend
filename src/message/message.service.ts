import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private pusher: PusherService,
  ) {}

  async createMessage(conversationId: number, senderId: number, text: string) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        text,
      },
    });

    await this.pusher.trigger(
      `conversation-${conversationId}`,
      'new-message',
      message,
    );

    return message;
  }

  getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
