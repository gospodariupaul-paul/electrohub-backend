import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { DeliverySettingsService } from './delivery-settings.service';
import { UpdateDeliverySettingsDto } from './dto/update-delivery-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('delivery-settings')
@UseGuards(JwtAuthGuard)
export class DeliverySettingsController {
  constructor(private readonly service: DeliverySettingsService) {}

  @Get('me')
  getMySettings(@Req() req: any) {
    return this.service.getForUser(req.user.sub);
  }

  @Patch('me')
  updateMySettings(@Req() req: any, @Body() dto: UpdateDeliverySettingsDto) {
    return this.service.updateForUser(req.user.sub, dto);
  }
}
