import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from "@nestjs/common";
import { SupportService } from "./support.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("support")
export class SupportController {
  constructor(private supportService: SupportService) {}

  // 🔥 User trimite mesaj către admin
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSupportMessage(
    @Req() req,
    @Body() body: { subject: string; message: string }
  ) {
    return this.supportService.create({
      userId: req.user.id,
      subject: body.subject,
      message: body.message,
    });
  }

  // 🔥 Admin vede toate mesajele
  @UseGuards(JwtAuthGuard)
  @Get("admin")
  async getAllMessages(@Req() req) {
    if (req.user.role !== "admin") return [];

    return this.supportService.getAll();
  }

  // 🔥 Admin vede un mesaj
  @UseGuards(JwtAuthGuard)
  @Get("admin/:id")
  async getMessage(@Req() req, @Param("id") id: string) {
    if (req.user.role !== "admin") return null;

    return this.supportService.getOne(Number(id));
  }

  // 🔥 Admin răspunde la mesaj
  @UseGuards(JwtAuthGuard)
  @Patch("admin/:id/reply")
  async replyMessage(
    @Req() req,
    @Param("id") id: string,
    @Body() body: { reply: string }
  ) {
    if (req.user.role !== "admin") return null;

    return this.supportService.reply(Number(id), body.reply);
  }
}
