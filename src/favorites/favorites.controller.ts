import { Controller, Post, Delete, Get, Param, UseGuards, Req } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { AuthGuard } from "../auth/auth.guard";
import { Request } from "express";
import { RequestContext } from "../auth/request-context";

@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly context: RequestContext
  ) {}

  @Post(":productId")
  add(@Req() req: Request, @Param("productId") productId: string) {
    this.context.user = req.user; // 🔥 FIX
    return this.favoritesService.addFavorite(Number(productId));
  }

  @Delete(":productId")
  remove(@Req() req: Request, @Param("productId") productId: string) {
    this.context.user = req.user; // 🔥 FIX
    return this.favoritesService.removeFavorite(Number(productId));
  }

  @Get("me")
  getMyFavorites(@Req() req: Request) {
    this.context.user = req.user; // 🔥 FIX
    return this.favoritesService.getMyFavorites();
  }
}
