import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private service: MessageService) {}

  // 🔥 Trimitere mesaj într-o conversație EXISTENTĂ
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req,
    @Body()
    body: {
      conversationId: number;
      text: string;
    },
  ) {
    const senderId = req.user?.id;

    if (!senderId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!body.conversationId || !body.text) {
      throw new BadRequestException('Missing fields');
    }

    return this.service.createMessage(
      body.conversationId,
      senderId,
      body.text,
    );
  }

  // 🔥 Citire mesaje: /messages/:conversationId
  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  getById(@Req() req, @Param('conversationId') conversationId: string) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.getMessages(Number(conversationId));
  }

  // 🔥 Marchează TOATE mesajele ca citite
  @UseGuards(JwtAuthGuard)
  @Post('mark-all-read')
  markAllRead(@Req() req) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.markAllAsRead(userId);
  }
}
