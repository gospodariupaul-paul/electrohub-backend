import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliverySettings } from "./entities/delivery-settings.entity";
import { DeliverySettingsService } from "./delivery-settings.service";
import { DeliverySettingsController } from "./delivery-settings.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySettings])],
  controllers: [DeliverySettingsController],
  providers: [DeliverySettingsService],
  exports: [DeliverySettingsService],
})
export class DeliverySettingsModule {}
