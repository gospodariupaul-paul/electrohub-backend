import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 OBLIGATORIU
    }),
    // restul modulelor tale...
  ],
})
export class AppModule {}
