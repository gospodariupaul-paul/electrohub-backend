import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private pusher: PusherService,
  ) {}

  // 🔥 Creează mesaj într-o conversație EXISTENTĂ
  async createMessage(conversationId: number, senderId: number, text: string) {
    if (!conversationId || !senderId || !text) {
      throw new BadRequestException('Missing fields');
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        text,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    await this.pusher.trigger(
      `conversation-${conversationId}`,
      'new-message',
      message,
    );

    return message;
  }

  // 🔥 Returnează toate mesajele din conversație
  async getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 🔥 Marchează TOATE mesajele necitite ca citite
  async markAllAsRead(userId: number) {
    return this.prisma.message.updateMany({
      where: {
        senderId: { not: userId },
        isRead: false,
        conversation: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
      },
      data: { isRead: true },
    });
  }

  // 🔥 Șterge mesaj DOAR pentru tine
  async deleteForMe(messageId: number, userId: number) {
    return this.prisma.messageUser.deleteMany({
      where: {
        messageId,
        userId,
      },
    });
  }

  // 🔥 Șterge mesaj pentru TOȚI
  async deleteForAll(messageId: number, userId: number) {
    const msg = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!msg) {
      throw new BadRequestException('Mesajul nu există');
    }

    if (msg.senderId !== userId) {
      throw new BadRequestException('Nu poți șterge pentru toți');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        deletedForAll: true,
        text: 'Acest mesaj a fost șters',
      },
    });
  }
}
