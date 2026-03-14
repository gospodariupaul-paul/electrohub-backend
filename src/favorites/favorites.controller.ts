import { Controller, Post, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(":productId")
  add(@Param("productId") productId: string) {
    return this.favoritesService.addFavorite(Number(productId));
  }

  @Delete(":productId")
  remove(@Param("productId") productId: string) {
    return this.favoritesService.removeFavorite(Number(productId));
  }

  @Get("me")
  getMyFavorites() {
    return this.favoritesService.getMyFavorites();
  }
}
