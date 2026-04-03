import { Module } from '@nestjs/common';
import { FanCourierService } from './fancourier.service';
import { FanCourierController } from './fancourier.controller';

import { FanCourierLockerService } from './fancourier.locker.service';
import { FanCourierLockerController } from './fancourier.locker.controller';

import { PrismaService } from '../../prisma/prisma.service';
import { FanCourierClient } from './fancourier.client';

@Module({
  controllers: [
    FanCourierController,
    FanCourierLockerController, // ⭐ ADĂUGAT
  ],
  providers: [
    FanCourierService,
    FanCourierLockerService, // ⭐ ADĂUGAT
    FanCourierClient,
    PrismaService,
  ],
})
export class FanCourierModule {}
