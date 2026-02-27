import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  // 🔥 Creează conversația pe baza buyerId + productId
  // SellerId îl luăm automat din produs
  async createConversation(buyerId: number, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Produsul nu există');
    }

    const sellerId = product.userId;

    // 🔥 Verificăm dacă există deja conversația
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

  // 🔥 Căutăm conversația pentru buyer + product
  async getConversation(buyerId: number, productId: number) {
    return this.prisma.conversation.findFirst({
      where: { buyerId, productId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  // 🔥 Obținem conversația după ID, dar verificăm că userul are acces
  async getConversationById(id: number, userId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) {
      throw new BadRequestException('Conversația nu există');
    }

    // 🔥 Userul trebuie să fie buyer sau seller
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new BadRequestException('Nu ai acces la această conversație');
    }

    return conversation;
  }

  // 🔥 Conversațiile pentru vânzător sau cumpărător
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
