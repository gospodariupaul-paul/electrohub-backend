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
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('conversations')
export class ConversationController {
  constructor(private service: ConversationService) {}

  // 🔥 Crearea conversației trebuie să fie protejată
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req,
    @Body()
    body: {
      productId: number;
    },
  ) {
    const buyerId = req.user?.id; // Cine inițiază chatul = buyer

    if (!buyerId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!body.productId) {
      throw new BadRequestException('Product ID missing');
    }

    return this.service.createConversation(buyerId, body.productId);
  }

  // 🔥 Conversațiile pentru vânzător sau cumpărător (user)
  // IMPORTANT: ruta asta trebuie să fie înainte de ':id'
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getForUser(@Req() req, @Param('userId') userId: string) {
    const authUserId = req.user?.id;

    if (!authUserId) {
      throw new BadRequestException('User not authenticated');
    }

    if (Number(userId) !== authUserId) {
      throw new BadRequestException('Access denied');
    }

    return this.service.getConversationsForUser(Number(userId));
  }

  // 🔥 Căutăm conversația DOAR după productId și buyerId (din token)
  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req, @Query('productId') productId: string) {
    const buyerId = req.user?.id;

    if (!buyerId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.getConversation(buyerId, Number(productId));
  }

  // 🔥 Obținem conversația după ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.getConversationById(Number(id), userId);
  }

  // 🔥 Marchează mesajele ca citite în conversație
  @UseGuards(JwtAuthGuard)
  @Post('mark-read/:id')
  markRead(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.service.markMessagesAsRead(Number(id), userId);
  }
}
