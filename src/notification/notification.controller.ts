import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Req, 
  Param,
  UseGuards 
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('settings/me')
  getSettings(@Req() req) {
    return this.notificationService.getSettings(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('settings')
  saveSettings(@Req() req, @Body() dto: UpdateSettingsDto) {
    return this.notificationService.saveSettings(Number(req.user.id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyNotifications(@Req() req) {
    return this.notificationService.getByUser(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notificationService.delete(Number(id));
  }
}
