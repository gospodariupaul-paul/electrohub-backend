import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { HelpService } from './help.service';
import { ContactDto } from './dto/contact.dto';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  // ============================
  // FAQ
  // ============================
  @Get('faq')
  getFaq() {
    return this.helpService.getFaq();
  }

  // ============================
  // CONTACT (EMAIL)
  // ============================
  @Post('contact')
  sendContactMessage(@Body() dto: ContactDto) {
    return this.helpService.sendContactMessage(dto);
  }

  // ============================
  // POLICIES
  // ============================
  @Get('policies')
  getPolicies() {
    return this.helpService.getPolicies();
  }

  // ============================
  // STATUS
  // ============================
  @Get('status')
  getStatus() {
    return this.helpService.getStatus();
  }

  // ============================
  // SUPORT INTERN — USER → ADMIN
  // ============================
  @Post('support')
  saveSupportMessage(
    @Req() req,
    @Body() body: { subject: string; message: string }
  ) {
    const userId = req.user.id; // user logat
    return this.helpService.saveSupportMessage(
      userId,
      body.subject,
      body.message
    );
  }

  // ============================
  // SUPORT INTERN — ADMIN VEDE MESAJELE
  // ============================
  @Get('support')
  getSupportMessages() {
    return this.helpService.getSupportMessages();
  }
}
