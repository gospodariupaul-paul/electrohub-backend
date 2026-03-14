import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RequestContext } from "../auth/request-context";

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    private context: RequestContext
  ) {}

  async addFavorite(productId: number) {
    const userId = this.context.user.id;

    return this.prisma.favorite.create({
      data: { userId, productId },
    });
  }

  async removeFavorite(productId: number) {
    const userId = this.context.user.id;

    return this.prisma.favorite.deleteMany({
      where: { userId, productId },
    });
  }

  async getMyFavorites() {
    const userId = this.context.user.id;

    return this.prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
    });
  }
}
