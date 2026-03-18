import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { VerificationService } from "./verification.service";
import type { Request } from "express";
import * as jwt from "jsonwebtoken";

@Controller("verify")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  private getUserId(req: Request): number {
    // 🔥 Folosim cookie-ul corect: "jwt"
    const token = req.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException("Trebuie să fii autentificat.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Dacă în token ai "sub", folosești sub
    return decoded.sub;
  }

  @Post("request")
  requestCode(
    @Req() req: Request,
    @Body() body: { method: "email" | "phone" }
  ) {
    const userId = this.getUserId(req);
    return this.verificationService.requestVerification(userId, body.method);
  }

  @Post("confirm")
  confirmCode(@Req() req: Request, @Body() body: { code: string }) {
    const userId = this.getUserId(req);
    return this.verificationService.verifyCode(userId, body.code);
  }
}
