import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private pusher: PusherService,
  ) {}

  async getOrCreateConversation(buyerId: number, sellerId: number, productId: number) {
    let conversation = await this.prisma.conversation.findFirst({
      where: { buyerId, sellerId, productId },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { buyerId, sellerId, productId },
      });
    }

    return conversation;
  }

  async createMessage(
    buyerId: number,
    sellerId: number,
    productId: number,
    senderId: number,
    text: string,
  ) {
    const conversation = await this.getOrCreateConversation(
      buyerId,
      sellerId,
      productId,
    );

    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        text,
      },
    });

    // 🔥 Actualizează updatedAt pentru sortare corectă
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // 🔥 Trimite mesajul prin Pusher
    await this.pusher.trigger(
      `conversation-${conversation.id}`,
      'new-message',
      message,
    );

    return { conversationId: conversation.id, message };
  }

  getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
