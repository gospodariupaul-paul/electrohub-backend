import { Module } from '@nestjs/common';
import { DeliverySettingsService } from './delivery-settings.service';
import { DeliverySettingsController } from './delivery-settings.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DeliverySettingsController],
  providers: [DeliverySettingsService, PrismaService],
})
export class DeliverySettingsModule {}
