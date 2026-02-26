import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Auth
import { AuthModule } from './auth/auth.module';

// Users
import { UserModule } from './user/user.module';

// Products
import { ProductModule } from './product/product.module';

// Categories
import { CategoryModule } from './category/category.module';

// Orders
import { OrderModule } from './order/order.module';

// Conversations
import { ConversationModule } from './conversation/conversation.module';

// Messages
import { MessageModule } from './message/message.module';

// Pusher
import { PusherService } from './pusher/pusher.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [],
  providers: [PrismaService, PusherService],
})
export class AppModule {}
