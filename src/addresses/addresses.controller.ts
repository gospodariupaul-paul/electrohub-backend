import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AddressesService } from "./addresses.service";
import type { Request } from "express";

@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAddresses(@Req() req: Request) {
    const userId = req.user["id"];
    return this.addressesService.getAddresses(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addAddress(
    @Req() req: Request,
    @Body() body: { name: string; address: string; city: string }
  ) {
    const userId = req.user["id"];
    return this.addressesService.addAddress(userId, body);
  }
}
