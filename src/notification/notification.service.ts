import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: number,
    text: string,
    link?: string,
    images?: string[]
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        text,
        link: link ?? null,   // 🔥 aici vine link-ul corect
        images: images ?? [],
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
    return this.prisma.notificationSettings.findUnique({
      where: { userId },
    });
  }

  async saveSettings(userId: number, settings: any) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      update: settings,
      create: { userId, ...settings },
    });
  }
}
