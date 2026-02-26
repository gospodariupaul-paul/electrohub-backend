import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  createConversation(buyerId: number, sellerId: number, productId: number) {
    return this.prisma.conversation.create({
      data: { buyerId, sellerId, productId },
    });
  }

  getConversation(buyerId: number, productId: number) {
    return this.prisma.conversation.findFirst({
      where: { buyerId, productId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  getConversationById(id: number) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  // 🔥 METODA LIPSĂ — OBLIGATORIE PENTRU LISTA VANZATORULUI
  getConversationsForUser(userId: number) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
