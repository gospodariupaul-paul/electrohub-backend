import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
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

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getConversationById(Number(id));
  }

  // 🔥 RUTA LIPSĂ — OBLIGATORIE PENTRU VANZATOR
  @Get('user/:userId')
  getForUser(@Param('userId') userId: string) {
    return this.service.getConversationsForUser(Number(userId));
  }
}
