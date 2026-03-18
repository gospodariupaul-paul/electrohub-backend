import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as nodemailer from "nodemailer";
import { Twilio } from "twilio";

@Injectable()
export class VerificationService {
  private twilio: Twilio;

  constructor(private prisma: PrismaService) {
    this.twilio = new Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 🔥 Yahoo + Gmail fallback
  async sendEmailCode(email: string, code: string) {
    // 1️⃣ Yahoo Mail (principal)
    const yahooTransporter = nodemailer.createTransport({
      service: "yahoo",
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    });

    try {
      await yahooTransporter.sendMail({
        from: process.env.YAHOO_USER,
        to: email,
        subject: "Codul tău de verificare",
        text: `Codul tău este: ${code}`,
      });

      console.log("📮 Email trimis prin Yahoo");
      return;
    } catch (err) {
      console.error("❌ Yahoo a eșuat, încerc Gmail...");
    }

    // 2️⃣ Gmail (fallback)
    const gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await gmailTransporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Codul tău de verificare",
      text: `Codul tău este: ${code}`,
    });

    console.log("📧 Email trimis prin Gmail (fallback)");
  }

  async sendSmsCode(phone: string, code: string) {
    await this.twilio.messages.create({
      body: `Codul tău de verificare este: ${code}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
  }

  async requestVerification(userId: number, method: "email" | "phone") {
    const code = this.generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        verifyCode: code,
        verifyExpires: expires,
      },
    });

    if (method === "email") {
      await this.sendEmailCode(user.email, code);
    } else if (method === "phone" && user.phone) {
      await this.sendSmsCode(user.phone, code);
    }

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
