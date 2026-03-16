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

  @Post("login")
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    if (!user || !user["id"]) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return { message: "Already logged out" };
    }

    await this.authService.logout(user["id"]);

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return { message: "Logged out successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request) {
    const userId = req.user["id"];
    return this.authService.getUserById(userId);
  }
}
