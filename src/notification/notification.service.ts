import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // Creează notificare compatibilă cu Prisma
  async createNotification(
    userId: number,
    message: string,
    link?: string,
    images?: string[]
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
        link: link ?? null,
        images: images ?? [],
      },
    });
  }

  // Ia notificările utilizatorului
  async getByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Marchează notificarea ca citită
  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  // Șterge notificare
  async delete(id: number) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  // Setări notificări
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
