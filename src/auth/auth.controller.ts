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
import { UsersService } from "../users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // 🔥 COOKIE-URI CORECTE pentru Vercel ↔ Render
  private cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
  };

  @Post("register")
  async register(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(body);

    // 🔥 Setăm cookie-uri
    res.cookie("jwt", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.cookieOptions);

    // 🔥 Userul devine online
    await this.usersService.setUserOnline(user.id);

    return { user };
  }

  @Post("login")
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);

    // 🔥 Setăm cookie-uri
    res.cookie("jwt", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.cookieOptions);

    // 🔥 Userul devine online
    await this.usersService.setUserOnline(user.id);

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    // 🔥 ȘTERGEM COOKIE-URILE CU ACELEAȘI OPȚIUNI
    res.clearCookie("jwt", this.cookieOptions);
    res.clearCookie("refreshToken", this.cookieOptions);

    if (!user || !user["id"]) {
      return { message: "Already logged out" };
    }

    // 🔥 Userul devine offline
    await this.usersService.setUserOffline(user["id"]);

    await this.authService.logout(user["id"]);
    return { message: "Logged out successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request) {
    const userId = req.user!["id"];

    // 🔥 Actualizăm lastSeen la fiecare request
    await this.authService.updateLastSeen(userId);

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
