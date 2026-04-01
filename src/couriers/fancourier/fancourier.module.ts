import { Module } from "@nestjs/common";
import { FanCourierService } from "./fancourier.service";
import { FanCourierController } from "./fancourier.controller";
import { FanCourierClient } from "./fancourier.client";
import { PrismaService } from "@/prisma/prisma.service";

@Module({
  controllers: [FanCourierController],
  providers: [FanCourierService, FanCourierClient, PrismaService],
})
export class FanCourierModule {}
