import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { FanCourierClient } from "./fancourier.client";

@Injectable()
export class FanCourierService {
  constructor(
    private prisma: PrismaService,
    private fanClient: FanCourierClient
  ) {}

  async generateAwb(orderId: number, data: any) {
    // aici ulterior vei pune mapping real către API FanCourier
    const response = await this.fanClient.generateAwb(data);
    const awb = String(response.data).trim();

    const shipment = await this.prisma.shipment.create({
      data: {
        orderId,
        courier: "fancourier",
        awb,
        status: "created",
      },
    });

    return shipment;
  }

  async trackAwb(awb: string) {
    const response = await this.fanClient.trackAwb({ awb });
    return response.data;
  }

  async getShipmentsForOrder(orderId: number) {
    return this.prisma.shipment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}
