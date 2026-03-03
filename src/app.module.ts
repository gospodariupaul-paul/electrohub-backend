import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';

import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

import { PusherService } from './pusher/pusher.service';

// 🔥 ADĂUGAT
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ConversationModule,
    MessageModule,

    // 🔥 ADĂUGAT
    NotificationModule,
  ],
  controllers: [],
  providers: [PrismaService, PusherService],
})
export class AppModule {}
