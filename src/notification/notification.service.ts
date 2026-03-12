import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // 🔥 METODĂ NOUĂ — CREAȚI NOTIFICARE
  async createNotification(userId: number, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
        read: false,
      },
    });
  }

  async getByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async delete(id: number) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async getSettings(userId: number) {
    let settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.notificationSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  async updateSettings(userId: number, dto: any) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });
  }
}
