import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from "@nestjs/common";
import { SupportService } from "./support.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("support")
export class SupportController {
  constructor(private supportService: SupportService) {}

  // User trimite mesaj către admin
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

  // User vede mesajele lui + răspunsurile adminului
  @UseGuards(JwtAuthGuard)
  @Get("my")
  async getMyMessages(@Req() req) {
    return this.supportService.getByUser(req.user.id);
  }

  // User vede un singur mesaj după ID
  @UseGuards(JwtAuthGuard)
  @Get("my/:id")
  async getMyMessage(@Req() req, @Param("id") id: string) {
    return this.supportService.getOneByUser(Number(id), req.user.id);
  }

  // 🔥 User: numărul de răspunsuri primite de la admin
  @UseGuards(JwtAuthGuard)
  @Get("my/unread")
  async getUnreadReplies(@Req() req) {
    return this.supportService.countUnreadReplies(req.user.id);
  }

  // 🔥 User: șterge un mesaj de suport
  @UseGuards(JwtAuthGuard)
  @Patch("delete/:id")
  async deleteMessage(@Req() req, @Param("id") id: string) {
    return this.supportService.deleteMessage(req.user.id, Number(id));
  }

  // Admin vede toate mesajele
  @UseGuards(JwtAuthGuard)
  @Get("admin")
  async getAllMessages(@Req() req) {
    if (req.user.role !== "admin") return [];
    return this.supportService.getAll();
  }

  // Admin vede un mesaj
  @UseGuards(JwtAuthGuard)
  @Get("admin/:id")
  async getMessage(@Req() req, @Param("id") id: string) {
    if (req.user.role !== "admin") return null;
    return this.supportService.getOne(Number(id));
  }

  // Admin răspunde la mesaj
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

  // 🔥 Admin: șterge orice mesaj
  @UseGuards(JwtAuthGuard)
  @Patch("admin/delete/:id")
  async adminDeleteMessage(@Req() req, @Param("id") id: string) {
    if (req.user.role !== "admin") return null;
    return this.supportService.adminDelete(Number(id));
  }

  // 🔥 Admin: număr mesaje fără răspuns (pentru badge)
  @UseGuards(JwtAuthGuard)
  @Get("admin/pending/count")
  async getPendingCount(@Req() req) {
    if (req.user.role !== "admin") return 0;
    return this.supportService.countPending();
  }
}
