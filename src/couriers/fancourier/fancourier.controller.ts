import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { FanCourierService } from "./fancourier.service";

@Controller("fancourier")
export class FanCourierController {
  constructor(private fanService: FanCourierService) {}

  @Post("orders/:id/awb")
  async generateAwb(@Param("id") id: string, @Body() body: any) {
    const orderId = Number(id);
    return this.fanService.generateAwb(orderId, body);
  }

  @Get("tracking/:awb")
  async trackAwb(@Param("awb") awb: string) {
    return this.fanService.trackAwb(awb);
  }

  @Get("orders/:id/shipments")
  async getShipments(@Param("id") id: string) {
    const orderId = Number(id);
    return this.fanService.getShipmentsForOrder(orderId);
  }

  // ⭐ WEBHOOK FanCourier → actualizează statusul comenzii
  @Post("webhook")
  async webhook(@Body() body: any) {
    return this.fanService.processWebhook(body);
  }
}
