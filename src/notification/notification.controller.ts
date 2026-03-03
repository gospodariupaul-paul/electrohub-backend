import { Controller, Get, Param, Patch, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

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
