import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(buyerId: number, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new BadRequestException('Produsul nu există');

    const sellerId = product.userId;

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

  async getConversation(buyerId: number, productId: number) {
    return this.prisma.conversation.findFirst({
      where: { buyerId, productId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async getConversationById(id: number, userId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        buyer: true,
        seller: true,
        product: true,
      },
    });

    if (!conversation)
      throw new BadRequestException('Conversația nu există');

    if (conversation.buyerId !== userId && conversation.sellerId !== userId)
      throw new BadRequestException('Nu ai acces la această conversație');

    return conversation;
  }

  async getConversationsForUser(userId: number) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      orderBy: { updatedAt: 'desc' },

      include: {
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },

        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            text: true,
            createdAt: true,
            senderId: true,
            deletedForAll: true,
          },
        },

        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
    });

    return conversations.map((c) => ({
      id: c.id,
      updatedAt: c.updatedAt,
      otherUserName: c.buyerId === userId ? c.seller?.name : c.buyer?.name,
      productName: c.product?.name || 'Produs necunoscut',
      lastMessage: c.messages[0]?.text || '—',
      lastMessageDeletedForAll: c.messages[0]?.deletedForAll || false,
      unreadCount: c._count.messages,
    }));
  }

  async markMessagesAsRead(conversationId: number, userId: number) {
    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  // 🔥 ȘTERGE O CONVERSAȚIE
  async deleteConversation(id: number, userId: number) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conv) throw new BadRequestException('Conversația nu există');

    if (conv.buyerId !== userId && conv.sellerId !== userId)
      throw new BadRequestException('Nu ai voie să ștergi această conversație');

    await this.prisma.message.deleteMany({
      where: { conversationId: id },
    });

    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  // 🔥 ȘTERGE TOATE CONVERSAȚIILE USERULUI
  async deleteAllConversations(userId: number) {
    const convs = await this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    });

    for (const c of convs) {
      await this.prisma.message.deleteMany({
        where: { conversationId: c.id },
      });
    }

    return this.prisma.conversation.deleteMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    });
  }
}
