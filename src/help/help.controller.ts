import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
