import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';

// 🔥 Modulele noi pentru chat
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { PusherModule } from './pusher/pusher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,

    // 🔥 Modulele pentru chat în timp real
    ConversationModule,
    MessageModule,
    PusherModule,
  ],
})
export class AppModule {}
