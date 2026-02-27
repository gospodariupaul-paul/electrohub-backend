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
  async createMessage(conversationId: number, senderId: number, content: string) {
    if (!conversationId || !senderId || !content) {
      throw new BadRequestException('Missing fields');
    }

    // 🔥 Verificăm dacă conversația există
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    // 🔥 Creăm mesajul
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
    });

    // 🔥 Actualizăm updatedAt pentru sortare corectă
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // 🔥 Trimitem mesajul prin Pusher
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
}
