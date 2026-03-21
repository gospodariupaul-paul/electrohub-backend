import { Controller, Get, Post, Body, Req, UseGuards, Param } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RatingService } from "./rating.service";

@Controller("ratings")
export class RatingController {
  constructor(private ratingService: RatingService) {}

  // 🔥 Ratingurile mele (primite)
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMyRatings(@Req() req) {
    return this.ratingService.getRatingsForUser(req.user.id);
  }

  // 🔥 Ratingurile pe care le-am oferit altora
  @UseGuards(JwtAuthGuard)
  @Get("given")
  async getGivenRatings(@Req() req) {
    return this.ratingService.getRatingsGivenByUser(req.user.id);
  }

  // 🔥 Ratingurile unui alt utilizator (public)
  @UseGuards(JwtAuthGuard)
  @Get("user/:id")
  async getRatingsForOtherUser(@Param("id") id: string) {
    return this.ratingService.getRatingsForUser(Number(id));
  }

  // 🔥 Creează un rating nou
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRating(
    @Req() req,
    @Body() body: { toUserId: number; stars: number; comment?: string; transaction?: string }
  ) {
    return this.ratingService.createRating({
      fromUserId: req.user.id,
      ...body,
    });
  }

  // ⭐⭐⭐ MARCHEAZĂ RATINGURILE CA VĂZUTE
  @UseGuards(JwtAuthGuard)
  @Post("mark-seen")
  async markSeen(@Req() req) {
    return this.ratingService.markRatingsAsSeen(req.user.id);
  }
}
