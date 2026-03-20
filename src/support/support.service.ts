import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  // 🔥 Creează mesaj de suport
  async create(data: { userId: number; subject: string; message: string }) {
    return this.prisma.supportMessage.create({ data });
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
}
