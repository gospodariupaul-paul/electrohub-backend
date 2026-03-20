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

// Module noi
import { SavedSearchesModule } from './saved-searches/saved-searches.module';
import { AddressesModule } from './addresses/addresses.module';

// Health
import { HealthController } from './health.controller';

// Verificare email
import { VerificationModule } from './auth/verification.module';
import { EmailModule } from './email/email.module';

// AJUTOR / CONTACT / FAQ
import { HelpModule } from './help/help.module';

// 🔥 SUPORT — modulul pentru mesajele către admin
import { SupportModule } from './support/support.module';

// ⭐ RATING — modulul nou pentru ratinguri
import { RatingModule } from './rating/rating.module';

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

    // Module noi
    SavedSearchesModule,
    AddressesModule,

    // Module pentru verificare și email
    VerificationModule,
    EmailModule,

    // Modulul de Ajutor / Contact / FAQ
    HelpModule,

    // 🔥 Modulul de mesaje către admin
    SupportModule,

    // ⭐ Modulul de ratinguri
    RatingModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [PrismaService, PusherService],
})
export class AppModule {}
