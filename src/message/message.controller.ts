import { Controller, Post, Body, Get, Query, UseGuards, Req, BadRequestException, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private service: MessageService) {}

  // 🔥 Mesajele trebuie trimise DOAR de useri autentificați
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req,
    @Body()
    body: {
      buyerId: number;
      sellerId: number;
      productId: number;
      text: string;
    },
  ) {
    const senderId = req.user?.id;

    if (!senderId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.createMessage(
      body.buyerId,
      body.sellerId,
      body.productId,
      senderId,
      body.text,
    );
  }

  // 🔥 Citirea mesajelor prin query (?conversationId=)
  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req, @Query('conversationId') conversationId: string) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.getMessages(Number(conversationId));
  }

  // 🔥 Ruta pe care o cere frontend-ul: /messages/:conversationId
  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  getById(@Req() req, @Param('conversationId') conversationId: string) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.getMessages(Number(conversationId));
  }
}
