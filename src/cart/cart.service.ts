import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    return this.prisma.cartItem.upsert({
      where: {
        userId_productId: { userId, productId }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId,
        productId,
        quantity
      }
    });
  }
}
