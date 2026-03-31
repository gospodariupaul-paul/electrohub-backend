import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { DeliverySettingsService } from './delivery-settings.service';
import { UpdateDeliverySettingsDto } from './dto/update-delivery-settings.dto';

@Controller('delivery-settings')
export class DeliverySettingsController {
  constructor(private readonly service: DeliverySettingsService) {}

  @Get('me')
  getMySettings(@Req() req: any) {
    return this.service.getForUser(req.user.id);
  }

  @Patch('me')
  updateMySettings(@Req() req: any, @Body() dto: UpdateDeliverySettingsDto) {
    return this.service.updateForUser(req.user.id, dto);
  }
}
