import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private service: ConversationService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.createConversation(
      body.buyerId,
      body.sellerId,
      body.productId,
    );
  }

  @Get()
  get(@Query() query: any) {
    return this.service.getConversation(
      Number(query.buyerId),
      Number(query.productId),
    );
  }
}
