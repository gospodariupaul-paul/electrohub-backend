import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('conversations')
export class ConversationController {
  constructor(private service: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req,
    @Body()
    body: {
      productId: number;
    },
  ) {
    const buyerId = req.user?.id;

    if (!buyerId) throw new BadRequestException('User not authenticated');
    if (!body.productId) throw new BadRequestException('Product ID missing');

    return this.service.createConversation(buyerId, body.productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getForUser(@Req() req, @Param('userId') userId: string) {
    const authUserId = req.user?.id;

    if (!authUserId) throw new BadRequestException('User not authenticated');
    if (Number(userId) !== authUserId)
      throw new BadRequestException('Access denied');

    return this.service.getConversationsForUser(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req, @Query('productId') productId: string) {
    const buyerId = req.user?.id;

    if (!buyerId) throw new BadRequestException('User not authenticated');

    return this.service.getConversation(buyerId, Number(productId));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id;

    if (!userId) throw new BadRequestException('User not authenticated');

    return this.service.getConversationById(Number(id), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mark-read/:id')
  markRead(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id;

    if (!userId) throw new BadRequestException('User not authenticated');

    return this.service.markMessagesAsRead(Number(id), userId);
  }

  // 🔥 ȘTERGE O CONVERSAȚIE
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteConversation(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('User not authenticated');

    return this.service.deleteConversation(Number(id), userId);
  }

  // 🔥 ȘTERGE TOATE CONVERSAȚIILE USERULUI
  @UseGuards(JwtAuthGuard)
  @Delete('delete-all')
  deleteAll(@Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('User not authenticated');

    return this.service.deleteAllConversations(userId);
  }
}
