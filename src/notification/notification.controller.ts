import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Patch, 
  Delete, 
  Body, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // 🔥 NOU — GET SETTINGS (trebuie să fie înainte de :userId)
  @UseGuards(JwtAuthGuard)
  @Get('settings/me')
  getSettings(@Req() req) {
    return this.notificationService.getSettings(req.user.id);
  }

  // 🔥 NOU — UPDATE SETTINGS
  @UseGuards(JwtAuthGuard)
  @Post('settings')
  updateSettings(@Req() req, @Body() dto: UpdateSettingsDto) {
    return this.notificationService.updateSettings(req.user.id, dto);
  }

  // 🔥 EXISTENTE — trebuie să rămână DUPĂ settings
  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.notificationService.getByUser(Number(userId));
  }

  @Patch('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notificationService.delete(Number(id));
  }
}
