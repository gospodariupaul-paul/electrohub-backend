import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  // 🔥 Creează mesaj de suport
  async create(data: { userId: number; subject: string; message: string }) {
    return this.prisma.supportMessage.create({ data });
  }

  // 🔥 User: mesajele lui + răspunsurile adminului
  async getByUser(userId: number) {
    return this.prisma.supportMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        subject: true,
        message: true,
        reply: true,
        createdAt: true,
      },
    });
  }

  // 🔥 User: numărul de răspunsuri primite de la admin
  async countUnreadReplies(userId: number) {
    return this.prisma.supportMessage.count({
      where: {
        userId,
        reply: { not: null }
      }
    });
  }

  // 🔥 User: șterge un mesaj de suport
  async deleteMessage(userId: number, id: number) {
    return this.prisma.supportMessage.deleteMany({
      where: {
        id,
        userId
      }
    });
  }

  // 🔥 Admin: toate mesajele
  async getAll() {
    return this.prisma.supportMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }

  // 🔥 Admin: un mesaj
  async getOne(id: number) {
    return this.prisma.supportMessage.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // 🔥 Admin: răspunde la mesaj
  async reply(id: number, reply: string) {
    return this.prisma.supportMessage.update({
      where: { id },
      data: { reply },
    });
  }

  // 🔥 Admin: șterge orice mesaj
  async adminDelete(id: number) {
    return this.prisma.supportMessage.delete({
      where: { id }
    });
  }

  // 🔥 Admin: număr mesaje fără răspuns (pentru badge)
  async countPending() {
    return this.prisma.supportMessage.count({
      where: { reply: null }
    });
  }
}
