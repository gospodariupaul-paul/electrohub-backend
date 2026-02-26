import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private service: MessageService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.createMessage(
      body.buyerId,
      body.sellerId,
      body.productId,
      body.senderId,
      body.text,
    );
  }

  @Get()
  get(@Query('conversationId') conversationId: string) {
    return this.service.getMessages(Number(conversationId));
  }
}
