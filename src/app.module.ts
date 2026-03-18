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
import { NotificationModule } from './notification/notification.module';
import { FavoritesModule } from './favorites/favorites.module';

// 🔥 Module noi
import { SavedSearchesModule } from './saved-searches/saved-searches.module';
import { AddressesModule } from './addresses/addresses.module';

// 🔥 Importăm HealthController
import { HealthController } from './health.controller';

// 🔥 Importăm modulul de verificare
import { VerificationModule } from './auth/verification.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ConversationModule,
    MessageModule,
    NotificationModule,
    FavoritesModule,

    // 🔥 Module noi
    SavedSearchesModule,
    AddressesModule,

    // 🔥 AICI îl adăugăm
    VerificationModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [PrismaService, PusherService],
})
export class AppModule {}
