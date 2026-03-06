import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // 🔥 EXISTENT — notificări normale
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

  // 🔥 NOU — GET SETTINGS
  async getSettings(userId: string) {
    let settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    // Dacă nu există, îl creăm automat
    if (!settings) {
      settings = await this.prisma.notificationSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  // 🔥 NOU — UPDATE SETTINGS
  async updateSettings(userId: string, dto: any) {
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
