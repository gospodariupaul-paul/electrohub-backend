import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
    domain: ".up.railway.app", // 🔥 FIX CRUCIAL pentru cookie-uri cross-site
  };

  @Post("register")
  async register(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(body);

    res.cookie("jwt", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.cookieOptions);

    return { user };
  }

  @Post("login")
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);

    res.cookie("jwt", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.cookieOptions);

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    res.clearCookie("jwt", this.cookieOptions);
    res.clearCookie("refreshToken", this.cookieOptions);

    if (!user || !user["id"]) {
      return { message: "Already logged out" };
    }

    await this.authService.logout(user["id"]);
    return { message: "Logged out successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request) {
    const userId = req.user!["id"];
    return this.authService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("change-password")
  async changePassword(
    @Req() req: Request,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const userId = req.user!["id"];
    return this.authService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword
    );
  }
}
