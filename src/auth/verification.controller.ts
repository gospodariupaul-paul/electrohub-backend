import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { VerificationService } from "./verification.service";
import type { Request } from "express";

@Controller("verify")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post("request")
  requestCode(
    @Req() req: Request,
    @Body() body: { method: "email" | "phone" }
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.verificationService.requestVerification(
      (req.user as any).id,
      body.method
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("confirm")
  confirmCode(@Req() req: Request, @Body() body: { code: string }) {
    if (!req.user) throw new UnauthorizedException();
    return this.verificationService.verifyCode(
      (req.user as any).id,
      body.code
    );
  }
}
