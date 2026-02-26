import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

// Auth
import { AuthModule } from './auth/auth.module';

// Users
import { UsersModule } from './users/users.module';

// Products
import { ProductsModule } from './products/products.module';

// Categories
import { CategoriesModule } from './categories/categories.module';

// Orders
import { OrdersModule } from './orders/orders.module';

// Conversations
import { ConversationModule } from './conversation/conversation.module';

// Messages
import { MessageModule } from './message/message.module';

// Pusher
import { PusherService } from './pusher/pusher.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [],
  providers: [PrismaService, PusherService],
})
export class AppModule {}
