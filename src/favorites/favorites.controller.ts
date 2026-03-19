import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Get,
} from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { Request } from "express";

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":productId")
  async addFavorite(
    @Param("productId") productId: string,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const userId = (req.user as any).id;
    return this.favoritesService.addFavorite(userId, +productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":productId")
  async removeFavorite(
    @Param("productId") productId: string,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const userId = (req.user as any).id;
    return this.favoritesService.removeFavorite(userId, +productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFavorites(@Req() req: Request) {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const userId = (req.user as any).id;
    return this.favoritesService.getFavorites(userId);
  }
}
