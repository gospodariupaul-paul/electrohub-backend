import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  createConversation(buyerId: number, sellerId: number, productId: number) {
    return this.prisma.conversation.create({
      data: {
        buyerId,
        sellerId,
        productId,
      },
    });
  }

  getConversation(buyerId: number, productId: number) {
    return this.prisma.conversation.findFirst({
      where: { buyerId, productId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}
