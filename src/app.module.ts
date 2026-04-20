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

// 🔥 LIVRARE — modulul NOU pentru setările de livrare
import { DeliverySettingsModule } from './delivery/delivery-settings.module';

// 🚚 FANCOURIER — modulul NOU pentru AWB + tracking
import { FanCourierModule } from './couriers/fancourier/fancourier.module';

// 🛒 CART — modulul NOU pentru coșul de cumpărături (ADĂUGAT)
import { CartModule } from './cart/cart.module';

// ⭐⭐⭐ ADĂUGAT — modulul pentru apeluri (WebSocket Gateway)
import { CallGateway } from './call/call.gateway';

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

    // 🔥 Modulul NOU de setări livrare
    DeliverySettingsModule,

    // 🚚 Modulul FanCourier (AWB + tracking)
    FanCourierModule,

    // 🛒 Modulul de coș (SINGURA TA CERINȚĂ)
    CartModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [
    PrismaService,
    PusherService,

    // ⭐⭐⭐ ADĂUGAT — gateway-ul pentru apeluri
    CallGateway,
  ],
})
export class AppModule {}
