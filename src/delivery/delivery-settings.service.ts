import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliverySettings } from "./entities/delivery-settings.entity";
import { UpdateDeliverySettingsDto } from "./dto/update-delivery-settings.dto";

@Injectable()
export class DeliverySettingsService {
  constructor(
    @InjectRepository(DeliverySettings)
    private repo: Repository<DeliverySettings>,
  ) {}

  async getForUser(userId: number) {
    let settings = await this.repo.findOne({ where: { userId } });

    if (!settings) {
      settings = this.repo.create({ userId });
      await this.repo.save(settings);
    }

    return settings;
  }

  async updateForUser(userId: number, dto: UpdateDeliverySettingsDto) {
    let settings = await this.repo.findOne({ where: { userId } });

    if (!settings) {
      settings = this.repo.create({ userId, ...dto });
    } else {
      Object.assign(settings, dto);
    }

    return this.repo.save(settings);
  }
}
