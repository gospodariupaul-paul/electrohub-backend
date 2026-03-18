import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestVerification(userId: number, method: "email") {
    const code = this.generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        verifyCode: code,
        verifyExpires: expires,
      },
    });

    // 🔥 Trimitem codul prin email folosind Resend
    await this.emailService.sendVerificationCode(user.email, code);

    return { message: "Cod trimis" };
  }

  async verifyCode(userId: number, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.verifyCode || !user.verifyExpires) {
      return { success: false, message: "Nu există un cod activ" };
    }

    if (user.verifyExpires < new Date()) {
      return { success: false, message: "Cod expirat" };
    }

    if (user.verifyCode !== code) {
      return { success: false, message: "Cod invalid" };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verifyCode: null,
        verifyExpires: null,
      },
    });

    return { success: true };
  }
}
