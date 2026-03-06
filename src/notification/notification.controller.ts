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

  // 🔥 SETTINGS — trebuie să fie primele!
  @UseGuards(JwtAuthGuard)
  @Get('settings/me')
  getSettings(@Req() req) {
    return this.notificationService.getSettings(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('settings')
  updateSettings(@Req() req, @Body() dto: UpdateSettingsDto) {
    return this.notificationService.updateSettings(Number(req.user.id), dto);
  }

  // 🔥 NOTIFICĂRI NORMALE
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
