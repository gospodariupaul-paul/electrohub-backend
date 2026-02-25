import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private pusher: PusherService,
  ) {}

  // 🔥 Creează conversația dacă nu există
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

  // 🔥 Trimite mesaj + broadcast în timp real
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

    await this.pusher.trigger(
      `conversation-${conversation.id}`,
      'new-message',
      message,
    );

    return { conversationId: conversation.id, message };
  }

  // 🔥 Ia toate mesajele din conversație
  getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
