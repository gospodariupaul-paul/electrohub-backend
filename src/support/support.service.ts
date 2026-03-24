import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  // ============================
  // USER: creează mesaj
  // ============================
  async create(data: { userId: number; subject: string; message: string }) {
    return this.prisma.supportMessage.create({ data });
  }

  // ============================
  // USER: toate mesajele lui
  // ============================
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

  // ============================
  // USER: un mesaj
  // ============================
  async getOneByUser(id: number, userId: number) {
    const msg = await this.prisma.supportMessage.findFirst({
      where: { id, userId },
      select: {
        id: true,
        subject: true,
        message: true,
        reply: true,
        createdAt: true,
      },
    });

    if (!msg) {
      throw new NotFoundException("Mesajul nu există.");
    }

    return msg;
  }

  // ============================
  // USER: număr răspunsuri primite
  // ============================
  async countUnreadReplies(userId: number) {
    return this.prisma.supportMessage.count({
      where: {
        userId,
        reply: { not: null },
      },
    });
  }

  // ============================
  // USER: șterge mesajul lui
  // ============================
  async deleteMessage(userId: number, id: number) {
    return this.prisma.supportMessage.deleteMany({
      where: { id, userId },
    });
  }

  // ============================
  // ADMIN: toate mesajele (cu fallback)
  // ============================
  async getAll() {
    const messages = await this.prisma.supportMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    // 🔥 FIX: dacă user-ul lipsește, punem fallback
    return messages.map((m) => ({
      ...m,
      user: m.user ?? {
        id: 0,
        email: "unknown",
        name: "Unknown User",
      },
    }));
  }

  // ============================
  // ADMIN: un mesaj
  // ============================
  async getOne(id: number) {
    const msg = await this.prisma.supportMessage.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!msg) {
      throw new NotFoundException("Mesajul nu există.");
    }

    return {
      ...msg,
      user: msg.user ?? {
        id: 0,
        email: "unknown",
        name: "Unknown User",
      },
    };
  }

  // ============================
  // ADMIN: răspunde la mesaj
  // ============================
  async reply(id: number, reply: string) {
    return this.prisma.supportMessage.update({
      where: { id },
      data: { reply },
    });
  }

  // ============================
  // ADMIN: șterge mesaj
  // ============================
  async adminDelete(id: number) {
    return this.prisma.supportMessage.delete({
      where: { id },
    });
  }

  // ============================
  // ADMIN: număr mesaje fără răspuns
  // ============================
  async countPending() {
    return this.prisma.supportMessage.count({
      where: { reply: null },
    });
  }
}
