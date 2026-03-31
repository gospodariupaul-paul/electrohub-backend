import { Body, Controller, Get, Patch, Req } from "@nestjs/common";
import { DeliverySettingsService } from "./delivery-settings.service";
import { UpdateDeliverySettingsDto } from "./dto/update-delivery-settings.dto";

@Controller("delivery-settings")
export class DeliverySettingsController {
  constructor(private readonly service: DeliverySettingsService) {}

  @Get("me")
  getMySettings(@Req() req: any) {
    const userId = req.user.id; // JWT AuthGuard
    return this.service.getForUser(userId);
  }

  @Patch("me")
  updateMySettings(@Req() req: any, @Body() dto: UpdateDeliverySettingsDto) {
    const userId = req.user.id;
    return this.service.updateForUser(userId, dto);
  }
}
