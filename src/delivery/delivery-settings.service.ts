import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDeliverySettingsDto } from './dto/update-delivery-settings.dto';

@Injectable()
export class DeliverySettingsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: number) {
    let settings = await this.prisma.deliverySettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.deliverySettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  async updateForUser(userId: number, dto: UpdateDeliverySettingsDto) {
    return this.prisma.deliverySettings.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
