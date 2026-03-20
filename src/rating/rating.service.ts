import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async createRating(data: {
    fromUserId: number;
    toUserId: number;
    stars: number;
    comment?: string;
    transaction?: string;
  }) {
    return this.prisma.rating.create({ data });
  }

  async getRatingsForUser(userId: number) {
    return this.prisma.rating.findMany({
      where: { toUserId: userId },
      include: { fromUser: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRatingsGivenByUser(userId: number) {
    return this.prisma.rating.findMany({
      where: { fromUserId: userId },
      include: { toUser: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
