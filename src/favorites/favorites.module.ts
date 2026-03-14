import { Module } from "@nestjs/common";
import { FavoritesController } from "./favorites.controller";
import { FavoritesService } from "./favorites.service";
import { PrismaService } from "../prisma/prisma.service";
import { RequestContext } from "../auth/request-context";

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService, RequestContext],
})
export class FavoritesModule {}
